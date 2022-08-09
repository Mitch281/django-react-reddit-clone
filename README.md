<h1>Reddit Clone</h1>
https://threddit.netlify.app/
<p>
This repository is a reddit clone written in django on the backend and react and redux toolkit on the frontend. The database is a postgresql database. The backend simply serves as a rest api to the frontend using the django rest       framework. The styling of the application was completed mostly with css modules, although styled components were used with for loading indicators. JWT is used for user authentication.
</p>
<h2>Project Description</h2>
<h3>Installation</h3>
<p>
  First, clone this repository onto your local machine like so:<br />
  <code>
  git clone https://github.com/Mitch281/django-react-reddit-clone.git
  </code>
  <br />
  Now navigate into the repository:<br />
  <code>
    cd django-react-reddit-clone
  </code>
  <br />
  Now we install the required dependencies.
</p>
<h4>Backend Dependencies</h4>
<p>Before starting, please make sure you have pipenv installed: https://pypi.org/project/pipenv/. Also make sure you are in the root directory. Now start a virtual environment in the root directory and install dependencies: <br />
  <code>
    pipenv shell
    <br />
    pipenv install 
  </code>
</p>
<p>Next, generate a secret key like so:
  <code>
    cd backend
    <br />
    python manage.py shell
    <br />
    from django.core.management.utils import get_random_secret_key
    <br />
    get_random_secret_key()
  </code>
  Copy the secret key. Then make a file called .env in the backend directory (the directory which contains manage.py) and then put the following code:
  <code>SECRET_KEY={SECRET_KEY}</code>
</p>
<h4>Frontend Dependencies</h4>
<p>From the root folder, navigate to the frontend directory like so:<br />
  <code>
    cd frontend
  </code>
  <br />
  Now install the required dependencies:<br />
  <code>
    npm install
  </code>
  <br />
</p>
<h3>Running the program</h3>
<p>
  After following the steps above to install all dependencies, double check you are in the frontend directory, then run: <br />
  <code>
    npm start
  </code>
  <br />
</p>
<h3>Technologies Used</h3>
<h4>Backend</h4>
<ul>
  <li>Django</li>
  <li>Postgresql</li>
  <li>djangorestframework-simplejwt</li>
</ul>
<h4>Frontend</h4>
<ul>
  <li>React</li>
  <li>Redux Toolkit</li>
  <li>CSS Modules</li>
</ul>
<h3>Features</h3>
<ul>
  <li>Ability to create, edit and delete posts.</li>
  <li>Ability to create, edit, delete comments and reply to comments.</li>
  <li>Ability to create categories for posts.</li>
  <li>Nested comments (of unlimited length) with vertical lines to improve user experience when reading comment threads.</li>
  <li>Ability to show and hide replies.</li>
  <li>Ability to upvote and downvote posts and comments.</li>
  <li>Ability to sort posts and comments (sort by new, old, best, worst).</li>
  <li>Infinite scrolling for posts.</li>
  <li>Responsive Design.</li>
</ul>
<h3>Potential Future Features</h3>
<ul>
  <li>Infinite scrolling for comments.</li>
  <li>Support html markup in posts and comments.</li>
  <li>Add a dark mode.</li>
  <li>Ability for user to save posts</li>
</ul>

