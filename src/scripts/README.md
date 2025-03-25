# Database Update Scripts

These scripts update the database to support the new gender and women-only shuttle features.

## Prerequisites

1. Ensure you have Node.js installed (v14 or later recommended)
2. Install the required dependencies:

```bash
npm install mongodb dotenv uuid
```

## Environment Setup

Create a `.env` file in the root of your project with your MongoDB connection string:

```
MONGODB_URI=mongodb://your-mongodb-connection-string-here
```

If you're using a local MongoDB instance, you can set:

```
MONGODB_URI=mongodb://localhost:27017/shuttledb
```

## Running the Scripts

### 1. Update Users with Gender Field

This script adds the gender field to all existing users in the database and sets a specific test user to 'female'.

```bash
node src/scripts/update-users-gender.js
```

### 2. Update Shuttles with ShuttleType Field

This script:

- Updates all existing shuttles to have a 'general' shuttleType
- Creates women-only versions of some existing shuttles
- Adds example shuttles from the provided JSON schema

```bash
node src/scripts/update-shuttles-type.js
```

## Verifying Updates

After running these scripts, you can:

1. Check the MongoDB collections directly to verify the updates
2. Use the application search page to confirm women-only shuttles appear correctly
3. Test the women-only filter functionality (only visible to female users)

## Troubleshooting

If you encounter any issues:

1. Ensure MongoDB is running and accessible
2. Check the connection string in your .env file
3. Verify that the collections in your database are named 'users' and 'shuttles'
4. If needed, you can modify the scripts to match your specific database structure
