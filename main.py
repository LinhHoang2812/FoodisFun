from flask import Flask, render_template, redirect,url_for,request,flash,jsonify,abort
from forms import RegisterForm, LoginForm
from werkzeug.security import generate_password_hash,check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
import json
import os 
from dotenv import load_dotenv




load_dotenv()
secret_key = os.getenv("SECRET_KEY")


app = Flask(__name__)
app.secret_key = 'barboncino'
app.config['SECRET_KEY'] = f"{secret_key}"
## login manager
login_manager = LoginManager()
login_manager.init_app(app)



## create database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///foodfun.db"
app.app_context().push()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
db = SQLAlchemy(app)


## create tables
class User(UserMixin,db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String,nullable=False)
    password = db.Column(db.String(100),nullable=False)
    ################Parent relationship#######
    recipes = relationship('Recipes',back_populates="users" )
    groceries = relationship("Groceries", back_populates="users")

class Recipes(db.Model):
    __tablename__ = "recipes"
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.String,nullable=False)
    name = db.Column(db.String, nullable=False)
    image = db.Column(db.String,nullable=False)
    total_ingredient = db.Column(db.Integer,nullable=False)
    simple_list = db.Column(db.String,nullable=False)
    
    #######################child relationship################
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
        nullable=False)
    users = relationship('User',back_populates="recipes" )

class Groceries(db.Model):
    __tablename__ = "groceries"
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.String,nullable= False)
    item = db.Column(db.String, nullable= False)
    
    #######################child relationship################
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
        nullable=False)
    users = relationship('User',back_populates="groceries" )


db.create_all()





@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register',methods = ["POST","GET"])
def register():
    form = RegisterForm()
    if request.method == "POST":
        all_emails = [user.email for user in User.query.all()]
        email = request.form["email"]
        for mail in all_emails:
            if mail == email:
                flash("This email has already been used. Please log in!")
                return redirect(url_for("login"))

        hash_password = generate_password_hash(request.form["password"],method='pbkdf2:sha256', salt_length=8)
        new_user = User(username = request.form["name"], email =request.form["email"],password=hash_password )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for("homepage"))


    return render_template("register.html",form = form)



@app.route('/login',methods=["GET","POST"])
def login():
    form = LoginForm()
    
    if request.method == "POST":
        user = User.query.filter_by(email=request.form["email"]).first()
        if user != None:
            correct_password = check_password_hash(user.password,password = request.form["password"])
            if correct_password:
                login_user(user)
                return redirect(url_for("homepage"))
            else:
                flash("Please enter correct password!")
                return redirect(url_for("login"))
        else:
            flash("You havent registered, please register!")
            return redirect(url_for("register"))
     
    
    return render_template("login.html",form = form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('homepage'))



@app.route('/')
def homepage():
    return render_template("index.html")


@app.route('/recipe/<recipe_id>')
def get_recipe(recipe_id):
    return render_template("recipe.html")


@app.route('/save-recipe',methods=["POST"])
def save_recipe():
    data = request.get_json()
    if not current_user.is_authenticated:
        return f"/save/login/{data['id']}"
    
    recipe = Recipes(
        recipe_id = data["id"],
        name = data["name"],
        image = data["image"],
        total_ingredient = data["totalIngredients"],
        simple_list = json.dumps(data["simpleList"]),
        users = current_user,
    )
    db.session.add(recipe)
    db.session.commit()


    return "/mealboard"

@app.route('/save/login/<id>',methods=["GET","POST"])
def save_login(id):
    form = LoginForm() 
    if request.method == "POST":
       
        user = User.query.filter_by(email=request.form["email"]).first()
        if user != None:
            correct_password = check_password_hash(user.password,password = request.form["password"])
            if correct_password:
                login_user(user)
                return redirect(url_for("get_recipe",recipe_id=id))
            else:
                flash("Please enter correct password!")
                return redirect(url_for("save_login"))
        else:
            flash("You havent registered, please register!")
            return redirect(url_for("register"))
     
    return render_template("login.html",form = form)


@app.route('/mealboard',methods=["GET","POST"])
def get_mealboard():
    if not current_user.is_authenticated:
        return redirect(url_for("mealboard_login"))
    save_recipes = Recipes.query.filter_by(user_id= current_user.get_id()).all()
    save_items = Groceries.query.filter_by(user_id= current_user.get_id()).all()
    return render_template("mealboard.html",recipes = save_recipes,items = save_items)

@app.route('/mealboard/login',methods=["GET","POST"])
def mealboard_login():
    form = LoginForm() 
    if request.method == "POST":
       
        user = User.query.filter_by(email=request.form["email"]).first()
        if user != None:
            correct_password = check_password_hash(user.password,password = request.form["password"])
            if correct_password:
                login_user(user)
                return redirect(url_for("get_mealboard"))
                
            else:
                flash("Please enter correct password!")
                return redirect(url_for("mealboard_login"))
        else:
            flash("You havent registered, please register!")
            return redirect(url_for("register"))
     
     
    return render_template("login.html",form = form)

@app.route('/delete-all-recipe',methods=["POST"])
def delete_all_recipe():
    recipes_to_del = Recipes.query.filter_by(user_id=current_user.get_id()).all()
    for recipe in recipes_to_del:
        db.session.delete(recipe)
        db.session.commit()
    return "delete all recipes!"

@app.route('/delete-recipe',methods=["POST"])
def delete_recipe():
    id = request.get_json()
    recipe_to_del = Recipes.query.filter_by(user_id=current_user.get_id(),recipe_id = id["id"]).first()
    db.session.delete(recipe_to_del)
    db.session.commit()
    return "delete all recipes!"

    
@app.route('/save-item',methods=["POST"])
def save_item():
    item = request.get_json()
    new_item = Groceries(item_id = item["id"],item = item["item"],users = current_user)
    db.session.add(new_item)
    db.session.commit()
    return "save!"

@app.route('/delete-item',methods=["POST"])
def delete_item():
    id = request.get_json()
    item_to_del = Groceries.query.filter_by(user_id = current_user.get_id(),item_id = id["id"]).first()
    db.session.delete(item_to_del)
    db.session.commit()
    return "delete!"

@app.route('/delete-all-items',methods=["POST"])
def delete_all_items():
    all_items = Groceries.query.filter_by(user_id=current_user.get_id()).all()
    for item in all_items:
        db.session.delete(item)
        db.session.commit()
    return "delete all items!"



if __name__ == "__main__":
    app.run(debug=True)
