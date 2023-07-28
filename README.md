
# Reddit Clone

App: https://threddit.netlify.app/


This repository is a reddit clone written in 
django on the backend and react and redux 
toolkit on the frontend. The database is a postgresql 
database. The backend simply serves as a rest api to 
the frontend using the django rest framework. The 
styling of the application was completed with CSS modules.

## Technologies Used
### Backend
- Django
- Django Rest Framework
- PostgresSQL (with ORM)
- djangorestframework-simplejwt
### Frontend
- React
- Redux (Redux Toolkit)
- CSS Modules
- Webpack (through [Create React App](https://github.com/facebook/create-react-app))
### Deployment
- Frontend deployed on Netlify
- Backend deployed on Railway (previously deployed on Heroku prior to free tier removal)
### Features
- Ability to create, edit and delete posts/comments.
- Ability to create categories for posts.
- Nested comments of unlimited length.
- Ability to toggle the visiblity of comment replies.
- Ability to sort posts and comments by various metrics.
- Ability to sort posts by category.
- Ability to vote on comments and posts.
- Infinite scrolling when viewing posts.
### Desired Future Features
- Infinite Scrolling for comments (harder to implement due to nested nature of comments).
- Dark Mode
- Ability for users to save posts and comments as well as ability to view a user's posts and comments.
## Building
First, clone the repository onto your local machine
like so:
```
git clone https://github.com/Mitch281/django-react-reddit-clone.git
```
Now navigate into the repository:
```
cd django-react-reddit-clone
```
### Backend Dependencies
Before starting, make sure you have pipenv installed.
This can be instaled from https://pypi.org/project/pipenv/.
After installing, start a virtual environment and install dependencies like so:
```
pipenv shell
pipenv install
```
Next, create a .env file in the backend directory (the directory containing manage.py), and place the following code:
```
SECRET_KEY="1"
```
Note that this is just a placeholder secret key.


Next, generate a random secret key
```
cd backend
python manage.py shell
from django.core.management.utils import get_random_secret_key
get_random_secret_key()
```
Replace the "1" previously set as the secret key with the value generated.

Now exit the shell by typing 
```
exit()
```

### Frontend Dependencies
First, navigate back to the root directory like so:
```
cd ..
```
Next, make sure you have node installed. This can be installed from
https://nodejs.org/en/download/.
Now perform the below commands to install dependencies:
```
cd frontend
npm install
```
### Running the App
Open two seperate terminals and 
in the first terminal, perform (from the root directory):
```
pipenv shell
cd backend
python manage.py migrate <!-- Only necessary when running for first time. -->
python manage.py runserver
```
And in the second terminal (from the root directory):
```
cd frontend
npm start
```
Congratulations, the app is now running!

