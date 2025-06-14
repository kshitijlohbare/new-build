#!/bin/bash
# Fix all references to supabase in practiceUtils.fixed.ts
file="/Users/kshitijlohbare/Downloads/new build/new-build-main/src/context/practiceUtils.fixed.ts"
sed -i '' 's/await supabase\./await centralSupabase\./g' "$file"
sed -i '' 's/const dailyPromise = supabase/const dailyPromise = centralSupabase/g' "$file"
sed -i '' 's/const practicesPromise = supabase/const practicesPromise = centralSupabase/g' "$file"
