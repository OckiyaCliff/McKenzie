# McKenzie Auction Platform

## Overview
McKenzie is a token-based auction platform that allows users to create, manage, and participate in auctions. The platform supports various property types and provides a user-friendly interface for both buyers and sellers.

## Features
- **User Authentication**: Secure login and registration for users.
- **Auction Management**: Create, update, and delete auctions.
- **Bidding System**: Users can place bids on auctions with a minimum bid increment.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Image Uploads**: Supports image uploads for auction listings.
- **Admin Dashboard**: Manage auctions and user accounts from an admin interface.

## Technologies Used
- **Frontend**: React, Next.js, TypeScript
- **Backend**: Firebase Firestore for database management
- **Image Hosting**: ImageKit for image uploads
- **State Management**: React Hook Form for form handling and validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project setup

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mckenzie.git
   cd mckenzie
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:
   - Create a Firebase project and configure Firestore.
   - Set up authentication and storage as needed.
   - Update your `.env.local` file with your Firebase configuration:
     ```
     NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
     NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
     ```

### Running the Application
To start the development server, run:
```bash
npm run dev
# or
yarn dev
```
Open your browser and navigate to `http://localhost:3000`.

### Testing
Add tests as needed to ensure the functionality of your components. Use your preferred testing framework (e.g., Jest, React Testing Library).


## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Firebase](https://firebase.google.com/)
- [ImageKit](https://imagekit.io/)
- [Next.js](https://nextjs.org/)
