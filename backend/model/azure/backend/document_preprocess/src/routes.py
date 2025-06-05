from flask import Blueprint

# Create a Blueprint for routes
main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/')
def health_check():
    return "Healthy", 200
