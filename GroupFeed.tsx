import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar, 
  IconButton, Stack, Divider, Card, CardContent, CardActions, 
  CardHeader, Menu, MenuItem, Tooltip, CircularProgress } from '@mui/material';
import {
  ThumbUp, Favorite, EmojiEmotions, Celebration, SentimentDissatisfied,
  Mood, Comment, Send, MoreVert, Delete, Edit, PushPin
} from '@mui/icons-material';
import LinkIcon from '@mui/icons-material/Link';
import { useUser } from '@supabase/auth-helpers-react';
import * as feedUtils from './fitnessGroupFeedUtils';

interface GroupFeedProps {
  groupId: number;
  isAdmin?: boolean;
}

const GroupFeed: React.FC<GroupFeedProps> = ({ groupId, isAdmin = false }) => {
  const [posts, setPosts] = useState<feedUtils.FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [postLink, setPostLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, feedUtils.PostComment[]>>({});
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [anchorElMap, setAnchorElMap] = useState<Record<number, HTMLElement | null>>({});
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const user = useUser();

  // Fetch posts when component mounts or groupId changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const postsData = await feedUtils.getGroupPosts(groupId);
      setPosts(postsData);
      setLoading(false);
    };

    fetchPosts();
  }, [groupId]);

  // Handle post creation
  const handleCreatePost = async () => {
    if (!postContent && !postLink) return;
    
    setIsSubmitting(true);
    
    try {
      const newPost = await feedUtils.createGroupPost(
        groupId, 
        postContent, 
        postLink || null
      );
      
      if (newPost) {
        setPosts([newPost, ...posts]);
        setPostContent('');
        setPostLink('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle comments view
  const handleExpandComments = async (postId: number) => {
    const newExpandedState = !expandedComments[postId];
    setExpandedComments({...expandedComments, [postId]: newExpandedState});
    
    // Fetch comments if expanding and we don't have them yet
    if (newExpandedState && (!commentsMap[postId] || commentsMap[postId].length === 0)) {
      const comments = await feedUtils.getPostComments(postId);
      setCommentsMap({...commentsMap, [postId]: comments});
    }
  };

  // Handle adding a comment
  const handleAddComment = async (postId: number) => {
    const content = newComments[postId];
    if (!content) return;
    
    const newComment = await feedUtils.addPostComment(postId, content);
    
    if (newComment) {
      // Add to comments map
      const currentComments = commentsMap[postId] || [];
      setCommentsMap({
        ...commentsMap,
        [postId]: [...currentComments, newComment]
      });
      
      // Update post comment count
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {...post, comments_count: post.comments_count + 1};
        }
        return post;
      }));
      
      // Clear comment input
      setNewComments({...newComments, [postId]: ''});
    }
  };

  // Handle post reaction toggle
  const handleReaction = async (postId: number, reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry') => {
    const updatedReactions = await feedUtils.togglePostReaction(postId, reactionType);
    
    // Update post reactions in the state
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // Find the difference between old and new reactions
        const oldReactions = post.my_reactions || [];
        const addedReaction = updatedReactions.find(r => !oldReactions.includes(r));
        const removedReaction = oldReactions.find(r => !updatedReactions.includes(r));
        
        // Update the reaction count accordingly
        let newCount = post.reactions_count;
        if (addedReaction) newCount++;
        if (removedReaction) newCount--;
        
        return {...post, my_reactions: updatedReactions, reactions_count: newCount};
      }
      return post;
    }));
  };

  // Post menu handling
  const handlePostMenuOpen = (event: React.MouseEvent<HTMLElement>, postId: number) => {
    setAnchorElMap({...anchorElMap, [postId]: event.currentTarget});
  };

  const handlePostMenuClose = (postId: number) => {
    setAnchorElMap({...anchorElMap, [postId]: null});
  };

  // Handle post edit
  const handleEditPost = (post: feedUtils.FeedPost) => {
    setEditingPost(post.id);
    setEditContent(post.content || '');
    handlePostMenuClose(post.id);
  };

  const savePostEdit = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const success = await feedUtils.updateGroupPost(
      postId,
      editContent,
      post.link_url
    );
    
    if (success) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {...p, content: editContent};
        }
        return p;
      }));
    }
    
    setEditingPost(null);
  };

  // Handle post delete
  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    
    const success = await feedUtils.deleteGroupPost(postId);
    
    if (success) {
      setPosts(posts.filter(p => p.id !== postId));
    }
    
    handlePostMenuClose(postId);
  };

  // Handle pin/unpin post
  const handleTogglePin = async (postId: number, currentPinState: boolean) => {
    if (!isAdmin) return;
    
    const success = await feedUtils.togglePinPost(postId, !currentPinState);
    
    if (success) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {...p, is_pinned: !currentPinState};
        }
        return p;
      }));
    }
    
    handlePostMenuClose(postId);
  };

  // Render reaction buttons
  const renderReactionButtons = (post: feedUtils.FeedPost) => {
    const reactions = [
      { type: 'like', icon: <ThumbUp fontSize="small" />, label: 'Like' },
      { type: 'love', icon: <Favorite fontSize="small" />, label: 'Love' },
      { type: 'laugh', icon: <EmojiEmotions fontSize="small" />, label: 'Laugh' },
      { type: 'wow', icon: <Celebration fontSize="small" />, label: 'Wow' },
      { type: 'sad', icon: <SentimentDissatisfied fontSize="small" />, label: 'Sad' },
      { type: 'angry', icon: <Mood fontSize="small" />, label: 'Angry' }
    ];

    return reactions.map(reaction => (
      <Tooltip key={reaction.type} title={reaction.label}>
        <IconButton 
          size="small" 
          color={post.my_reactions?.includes(reaction.type) ? 'primary' : 'default'}
          onClick={() => handleReaction(post.id, reaction.type as any)}
        >
          {reaction.icon}
        </IconButton>
      </Tooltip>
    ));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      {/* Create Post Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Create Post
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          placeholder="Add a link (optional)"
          value={postLink}
          onChange={(e) => setPostLink(e.target.value)}
          disabled={isSubmitting}
          InputProps={{
            startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />
        
        <Stack direction="row" justifyContent="flex-end">
          <Button 
            variant="contained" 
            disabled={(!postContent && !postLink) || isSubmitting}
            onClick={handleCreatePost}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </Stack>
      </Paper>
      
      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No posts yet. Be the first to share something!
          </Typography>
        </Paper>
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 3, position: 'relative' }}>
            {post.is_pinned && (
              <Tooltip title="Pinned Post">
                <PushPin 
                  fontSize="small" 
                  color="primary" 
                  sx={{ position: 'absolute', top: 8, right: 8 }} 
                />
              </Tooltip>
            )}
            
            <CardHeader
              avatar={
                <Avatar src={post.user_avatar_url || undefined}>
                  {post.user_display_name?.charAt(0) || 'U'}
                </Avatar>
              }
              action={
                (user?.id === post.user_id || isAdmin) && (
                  <>
                    <IconButton onClick={(e) => handlePostMenuOpen(e, post.id)}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorElMap[post.id]}
                      open={Boolean(anchorElMap[post.id])}
                      onClose={() => handlePostMenuClose(post.id)}
                    >
                      {user?.id === post.user_id && (
                        <MenuItem onClick={() => handleEditPost(post)}>
                          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => handleDeletePost(post.id)}>
                        <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                      {isAdmin && (
                        <MenuItem onClick={() => handleTogglePin(post.id, post.is_pinned)}>
                          <PushPin fontSize="small" sx={{ mr: 1 }} />
                          {post.is_pinned ? 'Unpin' : 'Pin'}
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                )
              }
              title={post.user_display_name}
              subheader={new Date(post.created_at).toLocaleString()}
            />
            
            <CardContent>
              {editingPost === post.id ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={() => setEditingPost(null)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => savePostEdit(post.id)}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                    {post.content}
                  </Typography>
                  
                  {post.link_url && (
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        startIcon={<LinkIcon />} 
                        href={post.link_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {post.link_url}
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
            
            {/* Reactions and comments counts */}
            {(post.reactions_count > 0 || post.comments_count > 0) && (
              <Box sx={{ px: 2, pb: 1, display: 'flex', justifyContent: 'space-between' }}>
                {post.reactions_count > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    {post.reactions_count} reaction{post.reactions_count !== 1 ? 's' : ''}
                  </Typography>
                )}
                {post.comments_count > 0 && (
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleExpandComments(post.id)}
                  >
                    {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>
            )}
            
            <Divider />
            
            {/* Action buttons */}
            <CardActions>
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {renderReactionButtons(post)}
                </Box>
                
                <IconButton onClick={() => handleExpandComments(post.id)}>
                  <Comment />
                </IconButton>
              </Box>
            </CardActions>
            
            {/* Comments section */}
            {expandedComments[post.id] && (
              <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                {/* Comments list */}
                {commentsMap[post.id]?.map((comment) => (
                  <Box 
                    key={comment.id} 
                    sx={{ 
                      display: 'flex', 
                      mb: 2,
                      alignItems: 'flex-start',
                      gap: 1
                    }}
                  >
                    <Avatar 
                      src={comment.user_avatar_url || undefined}
                      sx={{ width: 32, height: 32 }}
                    >
                      {comment.user_display_name?.charAt(0) || 'U'}
                    </Avatar>
                    
                    <Box 
                      sx={{ 
                        flex: 1,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 1.5,
                        position: 'relative'
                      }}
                    >
                      <Typography variant="subtitle2">
                        {comment.user_display_name}
                      </Typography>
                      
                      <Typography variant="body2">
                        {comment.content}
                      </Typography>
                      
                      <Typography 
                        variant="caption" 
                        color="textSecondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                
                {/* Add comment */}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                  <Avatar 
                    src={user?.user_metadata?.avatar_url} 
                    sx={{ width: 32, height: 32 }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add a comment..."
                    value={newComments[post.id] || ''}
                    onChange={(e) => setNewComments({...newComments, [post.id]: e.target.value})}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton 
                          edge="end" 
                          disabled={!newComments[post.id]} 
                          onClick={() => handleAddComment(post.id)}
                        >
                          <Send fontSize="small" />
                        </IconButton>
                      )
                    }}
                  />
                </Box>
              </Box>
            )}
          </Card>
        ))
      )}
    </Box>
  );
};

export default GroupFeed;