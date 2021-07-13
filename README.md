
<h1 align="center">
  <br>
  <a href="https://engageclone.herokuapp.com"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png" alt="MS Teams Logo" width="200"></a>
  <br>
  TEAMS CLONE
  <br>
</h1>
<h4 align="center">Meet, chat, call, and collaborate in just one place.</h4>
<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#how-to-use">How To Use</a> 
</p>

<p align="center">
  Website : <a href="https://engageclone.herokuapp.com"> Teams Clone</a>
</p>
<p align="center">
  Developed by : Suman Saurav Jha
</p>

## About
Teams Clone is a web app inspired by Microsoft Teams <a href="https://www.microsoft.com/en-in/microsoft-teams/group-chat-software"> (see here) </a> which is a full fledged video calling and chat web app along with features of feed , collaboration and much more. This web app has been developed by Suman Saurav under the Microsoft engage program 2021 (June 12 - July 13)
<ul>  <b> Bulit with</b>
<ul>
<li>WebRTC</li>
<li>Web Socket</li>
<li> NodeJs </li> 
<li> Javascript</li>
<li> jQuery</li>
<li> Bootstrap</li>
<li> MongoDb</li>
<li> CSS</li>
<li> HTML</li>
<li>Others</li>
</ul>
</ul>
	

## Features
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#mandatory-feature">Mandatory Feature</a>
    </li>
    <li>
      <a href="#adopt-feature">Adopt Feature</a>
    </li>
    <li>
      <a href="#additional-features">Additional Features</a>
   </li>
      <ul>
        <li><a href="#authentication">Authentication</a></li>
        <li><a href="#meeting">Meeting</a></li>
        <li><a href="#chats">Chats</a></li>
	        <ul>
		        <li><a href="#personal-chats">Personal Chats</a></li>
		        <li><a href="#meeting-chats">Meeting Chats</a></li>
	      </ul>
        <li><a href="#feed">Feed</a></li>
        <li><a href="#miscellanous">Miscellanous</a></li>
      </ul>
    </li>
  </ol>
</details>

## Mandatory Feature

<li>A minimum of two participants are able to connect with each other 	       	  to have a video conversation.</li>

## Adopt Feature
A chat feature has been included where meeting participants can share info without disrupting the flow of the meeting. Through this chat feature, the participants are able to :
<li>View & Send messages.</li>
<li>Continue the conversation after the meeting</li>
<li>Start the conversation before the meeting. </li>

## Additional Features
Every feature except the mandatory feature has been listed down in this section with proper numbering. These feature have been well tested from my side and are fully functional.

### Authentication
 1. Sign Up using Google
 2. Fetch name , email and username of a user from Google
 3. Sign Up by manually filling user details (name , username , email , password)
 4. Unique username and email authentication
 5. Password hashing
 6. Automatic Login after a successful signup
 7. Sign In using Google
 8. Sign In by manually filling user details (username and password)
 9. Store target URL and redirect user to the target page on successful login
 10. Any unauthorized attack is prevented on website routes by defining middleware to check if a user is logged in or not
 11. Logout 
 12. Session storage 


### Meeting
13. Create new meeting
14. Every meeting has a unique room Id
15. Automatic creation of meet conversation on creating meeting room
16. Can set the name of the meeting
17. Automatic unique naming of meetings incase name isn't provided by the creator of the meeting
18. Join a meeting
19. Automatic creation of meet conversation on joining meeting room through invite link
20. Video call with multiple users in the meeting room
21. Mute your audio
22. Unmute your audio
23. Mute your video
24. Unmute your video
25. Share your screen
26. Stop sharing screen
27. Raise your Hand
28. Invite other people to join meeting
29. Get the joining time of every participant in the meeting
30. See the list of participants in the meeting
31. Chat in real time with all participants in the meeting
32. Know the name of the message sender
33. Realtime chat with people who are **NOT** in  the meeting but are present in the conversation group of the meeting
34. Realtime chats get saved to the database
35. User can switch their video to picture in picture mode , while switching to another tab
36. Hang up the call
37. Redirect to meeting conversations after hanging up
38. User can switch to feed , conversation and home while being in meeting 


### Chats
A user can have meet conversations and one to one conversations as well. 

#### Personal Chats
39. Create a one to one chat by using friends username
40.  Render previous messages of a conversation    
41.  Real time chat during conversation    
42.  Realtime conversation gets stored in the records
43.  Video call within personal conversation  
44.  Every message has its sending details (time and date)
45.  Switch between different personal conversations at the same place

#### Meeting Chats

46. Create new teams conversation    
47. Set the teams conversation name 
48. Automatic unique naming of conversation incase name isn't provided by the creator of the meeting
49. Automatic creation of a meeting room on creating teams conversation
50.  Join already created conversation    
51. See details (Room Name and number of participants ) of the teams conversation before joining
52. Fetch conversations of different teams conversations and meetings 
53. Render previous messages of a teams conversation     
54. Realtime chat with all the participants in a teams conversation 
55. Every teams conversation has a unique meeting room linked with it    
56.  Fetch messages being sent in the meeting room associated with the conversation , in real time    
57.  Send messages from teams conversation to the meeting room associated with it, in real time    
58.  New messages gets automatically saved in records  
59.  Can video call with other participants of the meeting conversation    
60.  See messages along with the sender name and time of message sent    
61.  Invite others to join the meet conversation
62. Switch between different teams conversations at the same place

### Feed
In Feed section , people in organization can post about upcoming events  and broadcast information and decisions to everyone else. Also they can stay updated with stuffs going around them.

63. See all feeds , stay updated with the events happening around and see who posted what and when
64. Create new post    
65.  Add images to your post from local device    
66.  Edit and Update your post    
67.  Delete your post    
68.  Authorization ( User can only edit and delete posts owned by them )

### Miscellanous
69. Flash success and error messages
70. Compatible with all devices


## How to use
[how to use?](https://youtu.be/u8yJi83vSeE) - Click to see the video , a step-by-step guide to make most of the features of the web app.


## Website demo video
[See demo](https://youtu.be/_Iz-x5iAToA) - This video has already been submitted with the "Submit your solution form".

<br> <br>

## Special Thanks 🙇
Ronak Dhoot Sir , my MS engage mentor for guiding me throughout the program!
