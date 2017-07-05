The create feature is the first real angular project that I have worked on.

It is very likely that the code is in no way optimal and might have some to many errors. My goal from next week is
to read more about structure and "proper" techniques used in angular projects. 

This is also my first time using CSS and HTML, I have been learning quite a lot with it, but I still have much to learn. The basic 
layout of all the pages is mainly so that I could implement the logic behind the playlist feature. They aren't meant to look nice, 
but I did try to make it look as pretty as I could.

Refactoring for next week:
    1) The new component was the first component that I created when I started. It is pretty messy and I need to reduce the number of 
        'useless' methods. Overall, the html needs to be reworked and the way I store/edit variables needs to be changed.
    
    2) The edit component needs to look a lot nicer, CSS needs to be fixed. 

    3) The play feature was the main focus of the whole create folder. I think it turned out pretty well, but some things in it should be
        greatly changed. The html layout needs to follow the "box model" and the css needs to be more organized. Many methods aren't called 
        anymore and will be removed once I finish refactoring. 

    Overall, I will need to change how playlist.service interacts with the create model. When it was created, I was only thinking about the 
    "new" subfeature of create. This led to some weird looking method calls and structure in the other subfeatures. The main focus of my 
    refactoring will be to create a smoother flow between the create model and the playlist.service. 


Changes I made to the project:
    1) I made it so the page view is only 75% of the window list, I found that many music sites do this because it looks much nicer and 
        it is a lot eaiser to layout the page. I also created a menu bar to the top of the page that is static.
    
    2) I added create to the menu bar. This feature allows the user to create a new playlist by providing youtube urls. The user can   
        also name the playlist and edit the songs in the current playlist. So far for edit, you can only add or delete a song. The final
        part of the create feature is the ability to actually listen to the created playlist. If the user has more than one playlist they can 
        select which one to listen to. They are able to turn on repeat so that the playlist always repeats. From the page they can also load 
        other playlists that they have created or they can append it to the end of the current playlist. The page uses the ng2-youtube-player
        package from npm, I couldn't get it working so I changed his code to work with our version. The only requirement is to import his typings
        I'm not sure if we upload them to github, if not I can provide it later.

    3) I added a playlist service, playlist class, and song class. They all act in the following way:
        song:
            The song class holds the img url, song url, and the song ID. Each playlist object has an array of song objects. The song ID     
            is used for loading the youtube player.
        
        playlist:
            The playlist class holds all of the songs. It holds the name of the playlists, the songs, and allows the user to append
            or delete a song to the playlist.

        playlist.service:
            The methods within the service are only called by other components in the create feature. It allows the user to add/create/etc 
            the playlist. I wrote it like this, because we will eventually be calling this so that we can access our api which will hold
            all of the playlist/user data. 


Also note: I have not unit tested any code