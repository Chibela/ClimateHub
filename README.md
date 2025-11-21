# Web Development Final Project - Climate Hub

Submitted by: **Chibela Changwe**

This web app:  
**Climate Hub** is a modern social platform focused on climate change awareness and action. Users can create and explore community posts about how they are fighting climate change, upvote and interact with content, learn through educational flashcards, and test their knowledge through simple climate quizzes; all within a calm, nature-inspired interface.

Time spent: **15+ hours** spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**

  - Form requires users to add a post title
  - Forms have the option for users to add:
    - additional textual content
    - an image added as an external image URL

- [x] **Web app includes a home feed displaying previously created posts**

  - Community feed displays previously created posts
  - By default, each post on the feed shows:
    - creation time
    - title
    - upvotes count
  - Clicking on a post directs the user to a detailed post page

- [x] **Users can view posts in different ways**

  - Users can sort posts by:
    - creation time
    - upvotes count
  - Users can search for posts by title

- [x] **Users can interact with each post in different ways**

  - Separate post page displays:
    - content
    - image
    - comments
  - Users can leave comments
  - Each post includes an upvote toggle button
    - Clicking increases likes
    - Clicking again removes the like

- [x] **A post that a user previously created can be edited or deleted**
  - Users can edit posts after creation
  - Users can delete posts from the post page

## Optional Features

- [x] Web app implements pseudo-authentication
  - Random user ID assigned and associated with posts
  - Only creators can edit/delete their posts
- [x] Interface customization (calm nature + social media style theme)
- [x] Users can add flags such as "Question" or "Opinion"
- [x] Users can filter posts by flags
- [x] Users can upload images from their local machine
- [x] Web app displays loading animation during data fetch

## Additional Features Implemented

- Climate learning flashcards with navigation
- Simple climate knowledge quiz section
- Smooth responsive layout
- Supabase-integrated image storage
- Like toggle system to prevent spam liking

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src="https://raw.githubusercontent.com/Chibela/ClimateHub/main/public/walkthrough9.gif" title="ClimateHub App Video Walkthrough"
alt="ClimateHub App Video Walkthrough" />

## Notes

Building Climate Hub involved configuring Supabase storage and handling state logic for like toggling. A key challenge was managing real-time UI updates while maintaining a clean and calm design aesthetic.

## License

Copyright 2025 Chibela Changwe
