# Community Feature Update

This update adds community sharing features to the wellbeing app, allowing users to:

1. Share their delights with the community
2. View practices shared by other users
3. Share tips and stories with the wellbeing community

## New Features

### Delights Community Sharing

Users can now share their daily delights to the community:

- Right-click on any delight in your personal feed to see the option to "Share to Community"
- Shared delights appear in the Community page under the "Delights" tab
- Users earn 3 additional points for sharing delights to the community

### Practice Sharing

The Community page now shows practices created by users:

- Users can now add community-shared practices to their own daily practices list
- Practice cards show all relevant information including benefits and streak counts

### Tips & Stories

Users can share wellbeing tips and personal stories:

- Create new tips or stories in the Tips & Stories tab
- Upvote helpful content from other users
- Comment on posts to engage with the community

## Setup Instructions

1. Run the SQL script to create the community_delights table in your Supabase database:

```
$ psql -d your_database_name -f supabase-community-delights.sql
```

2. Or execute the SQL in the Supabase dashboard SQL editor

## Implementation Details

- The `community_delights` table stores shared delights with username and user_id
- Row-level security ensures users can only edit or delete their own content
- The Community page uses tabs to organize different types of community content

## Future Enhancements

- Add notification system for when someone comments on your shared content
- Implement moderation features for community content
- Add ability to follow other users whose content you find helpful
