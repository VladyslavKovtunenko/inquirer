Installation npm packages:
-------------------------
        1. Go to the /frontend and /backend directory.
        2. Run in both 'npm i'.
        3. All dependencies from 'package.json' must be downloaded and installed.

Frontend assembly dependencies:
-------------------------------
        1. Go to the /frontend.
        2. Run 'bower i'.
        3. All dependencies from 'bower.json' must be downloaded and installed.

Gulp assembly tasks:
--------------------
        1. 'main' -> assembly *.{html, js, css} from /frontend/view to /static
        2. 'vendors' -> assemply only needed libs from /frontend/bower_components to /static/lib
        3. 'watch' -> remaking *.{html, js, css} after changing

DB usage:
--------
        1. Create empty database before reestablishing.
        2. DB dump in /backend/db/dump.
        3. Run 'psql database_name < dump_name'.

Running server:
--------------
        1. Server running by /backend/app.js with environment variables:
            1.1 NODE_ENV = development
            1.2 NODE_PATH = .

API requests:
------------
        1. /api/questions (GET)
            * Get all questions from DB, and rendering them.

        2. /api/question (POST)
            * Add question in DB. Question send by request's body.

        3. /api/question/id (PUT or DELETE)
            * Update or delete question from DB by id.

