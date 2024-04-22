# Medical Image Viewer

## Introduction
Welcome to the DICOM Image Viewer repository This full-stack web application is developed to handle and manipulate medical images in DICOM format, incorporating Flask for the backend, React with Redux for the frontend, and Docker for easy containerization.


https://github.com/basola21/DICOM-Image-Viewer/assets/63477635/c4488906-3a75-45cb-8127-520e97262a33


## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Installation and Setup
To get the application running on your local machine, follow these steps:

1. Clone the repository:
```git
git clone https://github.com/basola21/DICOM-Image-Viewer.git
```
2. Change directory into the project folder:
```
cd DICOM-Image-Viewer
```
3. Build the Docker containers:
```
docker-compose build
```
4. Launch the containers:
```
docker-compose up
```

### Optional
you can run the applicaiton outside docker by 

1. remove the `IN_DOCKER` variable from the backend/.env
2. make sure you have poetry installed
3. navigate to the backend dirictory and run `poetry install`
4. run `poetry shell` and then run `python run.py`
5. in the frontend dirictory run `npm install` given you have npm
6. run `npm run dev`

Now, open your web browser and navigate to `http://localhost:8080` to start using the DICOM Image Viewer.

#### Troubleshooting Errors
Should you encounter any issues during the use of this application, a simple refresh of the page often resolves these anomalies. Please note that this application is designed to operate smoothly without errors, and such issues are exceptions rather than the norm.

### Note: 
I have simplified the setup process as much as possible. For this purpose, `.env` files have been included in both the frontend and backend directories. It is important to note that this approach is generally not advisable due to potential security concerns with sensitive information. However, in the context of this particular repository, where there is no sensitive data involved, it has been implemented to facilitate an easier and more straightforward application setup experience.


### Rationale
The advanced image manipulation toolkit is designed to improve how users interact with medical images, facilitating better understanding and analysis.

### Integration
These features are fully integrated with the core functionalities, utilizing React for the frontend interactions and Redux for managing the application state.

## Development Requirements

- **Backend**: Flask is used to develop RESTful APIs for handling DICOM files and user data.
- **Frontend**: The frontend is built using React and Redux to create a dynamic and responsive user interface.
- **Docker**: The use of Docker facilitates consistent environments for development, testing, and production.

## Features

### Image Manipulation
Interacting with medical images, such as zooming and rotating capabilities, to enhance user experience and utility.

### Custom Feature: User Authentication
Basic user authentication features:
- **Registration**: Users can register to maintain a personal account.
- **Login/Logout**: Secure login and logout functionality implemented with JWT.

### Custom Feature: Image Collection
Users have the ability to create and manage their own collections of DICOM images, which can be revisited and studied later.

### Custom Feature: Image analysis
I have introduced a preliminary feature that enables users to send images back to the backend for analysis. Although this feature is currently incomplete, it serves as a demonstrative example of how such functionality might be implemented in future iterations of the application.

Currently, the feature allows the application to send the correct image back to the backend where it undergoes a basic analysis using the Harris Corner Detection algorithm. This process successfully retrieves certain keypoints from the image.

#### Limitations and Future Improvements
However, there are some known issues with the current implementation:

- The keypoints retrieved do not align perfectly with the image that is returned to the user.
- There are additional bugs that have not yet been resolved.

Due to time constraints, I was unable to fully refine this feature. It remains a work in progress, highlighting potential areas for further development and optimization in future updates.

## Data Privacy and Security

### Security Strategy
- **JWT Authentication**: Provides a secure way to handle user sessions.
- **Encryption of Filenames**: Safeguards against potential data breaches by obscuring file names.

### Justification
With the sensitive nature of medical data, it is critical to implement stringent security measures to protect user information and comply with regulatory standards.

## Reflections

### Design Decisions

### Frontend

In React development, decomposing the application into smaller, manageable components is typically a prudent design strategy. This approach facilitates easier maintenance and enhances scalability. However, in this project, I was not able to fully implement this strategy due to time constraints.

#### Constraints and Design Decisions

The development of certain complex features consumed a significant portion of the allotted time, which necessitated some compromises in other areas of the project. Specifically, I had to scale back on refactoring efforts. While the current structure of the application is functional and not suboptimal, there was a missed opportunity to further optimize the architecture.

#### Use of Cornerstone Library

In this project, the Cornerstone library was utilized for handling .dcm images. While the library effectively meets the project's needs, I would like to offer some critical feedback on its implementation as suggested in their documentation.

**Implementation Critique:**
The Cornerstone documentation recommends using the `useRef` hook to directly link a DOM element, which the library then uses to attach the viewer. This direct DOM manipulation approach is generally discouraged in modern web development practices as it may bypass the React rendering lifecycle, potentially leading to future bugs and maintenance challenges.

**Considerations for Small Applications:**
However, it's important to acknowledge that in the context of a smaller-scale application like this one, the direct impact of such issues might be minimal. Therefore, while not ideal, this approach can be deemed acceptable for the current scope of the project but might require reconsideration as the application scales.


#### Reflections on Improvements

Ideally, I would have preferred to refine the application’s structure by breaking it down into more granular components. This would have potentially improved both the readability and manageability of the code. 


### Backend

Flask is renowned for its lightweight and flexible nature as a backend framework, which provides significant agility in application development. However, this flexibility also places a heightened emphasis on the importance of a well-organized application structure.

#### Implementation Details

To capitalize on Flask's malleability while ensuring robust architecture, I have implemented a modular design where:
- Each model is isolated in its own file,
- Each schema resides in its own dedicated file,
- Each route is clearly defined in separate file.

This structure not only makes the backend easier to navigate but also simplifies future expansions and scaling efforts.

#### Scalability and Modularity

The chosen organizational approach enhances the modularity of the application, facilitating easier updates and maintenance. By segregating models, schemas, and routes, the application is poised for scalable growth, accommodating new features and modifications with minimal disruptions to the existing codebase.

### Docker 

#### Optimization Strategy

For the Docker configuration in this project, I have prioritized efficiency by selecting lighter images. This approach facilitates a quicker setup and reduces the overall disk space consumption, which can be particularly beneficial for users with limited system resources. These optimizations are part of our efforts to enhance user experience and ensure that the application is accessible and performant, even on lower-specification environments.

### Challenges and Solutions

As a software engineer, encountering code issues and problems is a daily aspect of the job. While minor issues are commonplace and not worth noting, there are significant challenges that require substantial time and effort to resolve. One such challenge involved the Vite Rollup configuration in my React application.

#### Vite Rollup Issue

**Problem Description:**
I integrated Vite in my React app to enhance the build and preview processes. The commands `npm run build` and `npm run preview` are used to run the application in a production setting. While these commands worked flawlessly outside of Docker, I encountered problems when attempting to execute them inside a Docker container. The issue was related to a Vite package called Rollup.

**Attempts to Resolve:**
- Initially, I tried to install and configure the problematic package directly inside the Docker environment. Despite various efforts and extensive research online, it became apparent that this issue was a known global bug.
- I considered rolling back the Vite version as a potential fix. However, this approach caused additional compatibility issues within the application, leading to further instability.

**Implemented Solution:**
Ultimately, I opted to use Nginx to serve the index file of the application. This workaround proved effective and allowed the production environment to function as intended.

**Reflection:**
Although using Nginx was not my initial approach of choice, it addressed the immediate needs of the project. Moving forward, I plan to monitor updates and potential fixes for the Vite Rollup issue, aiming to implement a more streamlined solution in future iterations of the application.

#### Database Migration Issue
Although this is not a big issue it took me a little bit to not see that I have not included the `flask migrate` command in my `entrypoint.sh` file which was not migrating the database as intended.

## Conclusion

The three-day sprint to develop the Medical Image Viewer has been a profound journey of technical and design challenges and to be honest I had fun.

### Project Reflections
Developing this application within such a condensed timeframe demanded strategic planning and decisive action, particularly concerning the application's architecture and feature set. Given the time constraints, not all envisioned features could be fully developed, such as the detailed decomposition of React components and full implementation of complex image analysis functionalities. These aspects are earmarked for future enhancement.

### Looking Ahead
As I reflect on this project, I am set to further refine these preliminary features and continuously evolve the application’s structure:
- **Component Modularity**: I plan to break down the React components more intricately to improve the code's readability and ease of maintenance.
- **Image Analysis Enhancement**: I aim to complete and expand the image analysis capabilities to incorporate more advanced algorithms and integrate these smoothly within the user interface.
- **Security Optimization**: Ongoing updates to the security protocols will be crucial to safeguard sensitive medical data effectively.

This short yet intense project not only honed my technical skills but also reinforced my commitment to thorough design and proactive problem-solving in software development. I am enthusiastic about applying these insights to future endeavors and am curious to see how the Medical Image Viewer will be adapted and utilized by medical professionals.

### Final Thoughts
I hope this tool proves to be a valuable asset for medical professionals, facilitating the efficient and secure processing of medical images. Thank you for considering my application through the DICOM Image Viewer project. I look forward to potentially contributing further to this field and appreciate any feedback that could help refine this application.

