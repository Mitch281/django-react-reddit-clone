<h1>Reddit Clone</h1>
https://threddit.netlify.app/
<p>
This repository is a reddit clone written in django and react, using a postgresql database. The backend simply serves as a rest api to the frontend using the django rest       framework. The styling of the application was completed mostly with css modules, although styled components were used with for loading indicators. No state management libraries were used. For authentication, JWT was used.
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
<p>Before starting, please make sure you have pipenv installed: https://pypi.org/project/pipenv/. Also make sure you are in the root directory. Now, we install the dependencies like so: <br />
  <code>
    pipenv install 
  </code>
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
</ul>
<h4>Frontend</h4>
<ul>
  <li>React</li>
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
  <li>Responsive Design.</li>
</ul>
<h3>Potential Future Features</h3>
<ul>
  <li>Support html markup in posts and comments.</li>
  <li>Add a dark mode.</li>
  <li>Ability for user to save posts</li>
</ul>

