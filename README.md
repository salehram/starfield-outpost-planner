# Starfield Outpost Planner

An intuitive tool designed to assist players of the "Starfield" video game. With the Starfield Outpost Planner, you can easily plan resources and modules for your in-game outposts, streamlining your gameplay experience.

## Features

* **Plan Your Outpost**: Select the modules you wish to build and see the required resources instantly.
* **Save & Share**: Save your builds and share them with friends or the Starfield community.
* **Quick Calculations**: Determine resource requirements, calculate total mass, and much more.
* **User-Friendly Interface**: Designed with gamers in mind, making your planning process effortless.

## Installation and Setup

### Online Version

Access the Starfield Outpost Planner directly online: [https://starfield-outpost-planner.app/](https://starfield-outpost-planner.app/).

### Self Hosting

1. **Prerequisite: MongoDB**: Before setting up the app, ensure you have MongoDB installed and running. The required database schemas are provided in the sample\_schemas.txt  
 file.
2. **Clone the Repository**:  
```bash
git clone https://github.com/salehram/starfield-outpost-planner.git
```

* **Navigate to the Directory**:  
```bash
cd starfield-outpost-planner
```

* **Install Dependencies**:  
```bash
pip install -r requirements.txt
```

* **Set Environment Variables**: 
You need to set the environment variables for the following:
  * **Database name**: DATABASE_NAME (EXPORT DATABASE_NAME='YOUR_DB_NAME' for Linux. For Windows: set DATABASE_NAME=YOUR_DB_NAME)
  * **Session secret key**: SECRET_KEY - any random string will be fine (EXPORT SECRET_KEY='RANDOM_SECRET_STR' for Linux. For Windows: set SECRET_KEY=RANDOM_SECRET_STR)
  * **MongoDB Server IP/name**: MONGODB_URI (EXPORT MONGODB_URI='MONGODB_SERVER_IP_OR_NAME' for Linux. For Windows: set MONGODB_URI=MONGODB_SERVER_IP_OR_NAME)
* **Run the App**:  
```bash
python app.py 
```

## Disclaimer

This tool is not affiliated with Microsoft, Bethesda, Starfield, or any other mentioned entity. All trademarks cited in this work are the property of their respective owners. This is a self-driven project with no incentives or affiliations.

## Contribution

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/salehram/starfield-outpost-planner/issues) if you want to contribute.

## Support

Give a ⭐️ if this project helped you! For direct help or inquiries, you can also reach out to me on [X (formerly Twitter) (@salehram87)](https://twitter.com/salehram87) or [LinkedIn](https://www.linkedin.com/in/salehram/).

## Acknowledgements

This project was developed with assistance from [ChatGPT by OpenAI](https://www.openai.com/). Their cutting-edge language model was instrumental in various stages of the development process.

## License

Licensed under the Apache License 2.0. See [LICENSE](https://chat.openai.com/c/LICENSE) for more details.
