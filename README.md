# DatingApp

<img width="1416" alt="DatingApp" src="https://github.com/user-attachments/assets/297b42a8-09f8-4b2e-907a-42609518d2e8" />


This is the repository for the **DatingApp** project, which includes both the backend (API) and frontend (client) components. The backend is built with .NET, and the frontend is developed using Angular.

## Project Structure

The project is divided into two main directories:

- `API`: Contains the .NET backend of the application.
- `client`: Contains the Angular frontend of the application.

## Prerequisites

Make sure you have the following installed on your machine:

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (which includes npm)
- [Angular CLI](https://angular.io/cli)
- [Docker](https://www.docker.com/)

## Getting Started

### Backend (API)

1. Navigate to the `API` directory:
   ```sh
   cd API
   ```

2. Restore the dependencies:
   ```sh
   dotnet restore
   ```

3. Run the application:
   ```sh
   dotnet run
   ```

### Frontend (client)

1. Navigate to the `client` directory:
   ```sh
   cd client
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Run the application:
   ```sh
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`.

## Using Docker

You can also run the project using Docker. Make sure Docker is installed and running on your machine.

### Docker Compose

A `docker-compose.yml` file is included to orchestrate the backend, frontend, and SQL Server services.

1. **Build and Run the Docker Containers**:
   ```sh
   docker-compose up --build
   ```

2. **Access the Services**:
   - The .NET backend (API) will be accessible at `http://localhost:5000`, `https://localhost:5001`.
   - The Angular frontend (client) will be accessible at `http://localhost:4200`, `http://localhost:4200`.
   - The SQL Server will be running and accessible on port `1433`.

### Dockerfile for API

The `API` directory contains a Dockerfile to build a Docker image for the .NET backend.

### Dockerfile for Client

The `client` directory contains a Dockerfile to build a Docker image for the Angular frontend.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## Contact

If you have any questions or suggestions, feel free to open an issue or contact the project maintainer.
