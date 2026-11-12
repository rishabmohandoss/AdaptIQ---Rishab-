# AdaptIQ — IT 491 Capstone Project

This repository is the shared workspace for the NJIT IT 491 capstone team. The team will test the existing software, fix issues, and build new features with guidance from the original project creators.

## About AdaptIQ

AdaptIQ is an interview practice platform designed to support neurodivergent job seekers. The existing project includes webcam and microphone analysis, live feedback, session scoring, and support profiles for ADHD, anxiety, and ASD.

## Project Goals

- Understand the existing code and features.
- Get the project running locally.
- Test the application and report issues.
- Improve usability and reliability.
- Develop new features with the project mentors.
- Keep setup instructions and documentation updated.

## Getting Access

1. Create a GitHub account.
2. Send your GitHub username to the repository owner.
3. Accept the collaborator invitation.
4. Clone this team's repository using the steps below.

## Getting Started

### Requirements

- Git
- Node.js and npm
- A modern browser
- A webcam and microphone for testing interview features

### Download the Project

On this repository's GitHub page, click **Code** and copy the HTTPS URL.

Replace `PASTE_REPOSITORY_URL_HERE` with the URL you copied:

```bash
git clone PASTE_REPOSITORY_URL_HERE AdaptIQ-IT491
cd AdaptIQ-IT491
```

### Run the Project

Start a local server:

```bash
npx serve .
```

Open the local URL shown in your terminal. Allow camera and microphone access when testing features that need them.

Some features require additional configuration. Check with the project mentors for the approved setup and review `config.example.js`.

Do not commit private API keys or credentials. Values included in browser JavaScript are visible to visitors.

## Project Structure

| File or Folder | Purpose |
| --- | --- |
| `index.html` | Site entry page |
| `app.html` | Application page |
| `frontend/` | Frontend components and assets |
| `perception/` | Webcam, gaze, and audio processing |
| `integration/` | Integration code |
| `PRD-details/` | Product requirements and design documents |
| `demo/` | Demo assets |
| `tests/` | Existing test files |
| `config.example.js` | Example runtime configuration |
| `projectplan.md` | Existing project plan |

## Contributing

### 1. Get the Latest Code

```bash
git switch main
git pull origin main
```

### 2. Create a Branch

Use your name and a short description of your task:

```bash
git switch -c your-name/task-name
```

### 3. Save and Upload Your Changes

Replace the example file path with the file you changed:

```bash
git add path/to/changed-file
git commit -m "Describe your change"
git push -u origin your-name/task-name
```

### 4. Open a Pull Request

Open a pull request on GitHub from your branch into `main`.

Include:

- What you changed
- Why you changed it
- How you tested it
- Screenshots if the appearance changed

Ask a teammate or mentor to review your work before merging.

## Testing and Reporting Issues

Test page loading, navigation, camera and microphone access, interview sessions, feedback, and session results.

When reporting a problem through GitHub Issues, include:

- A clear title
- Steps to reproduce the problem
- What you expected to happen
- What actually happened
- Your browser and operating system
- Relevant screenshots or error messages

Remove private information before posting screenshots or logs.

## Team Guidelines

- Discuss larger changes before starting.
- Use a separate branch for each task.
- Keep commits focused and clearly named.
- Test changes before submitting a pull request.
- Update documentation when setup or features change.
- Keep original credits and applicable license notices.

## Original Project and Credits

This repository is forked from the [original AdaptIQ repository](https://github.com/rishabmohandoss/AdaptIQ---Rishab-).

AdaptIQ was originally built at the Claude NJIT Hackathon 2026 by:

- Sneh Bhatt
- Mayukha Ajeesh Ramsha Nath
- Rishab Mohandoss
- Aagam Ambavi

The NJIT IT 491 capstone team is continuing development of the existing project.
