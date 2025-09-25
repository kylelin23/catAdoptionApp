# Cat Adoption App

## Project Description:
The goal of this app is to let new cat adopters have a more smooth adoption. There are countless things to remember and worry about when adopting a cat, such as what to feed them, whether or not to let them outside, and much more. So, this app's goal is to create a **user-friendly way for new cat adopters to easily access reliable information on cat adoption.**

**Technologies Used:**
React Native, Expo Go

**Frontend UI Design:** [Figma](https://www.figma.com/design/DDKC8hf5LSOV17jN65XbSx/Cat-Adoption-App?node-id=0-1&t=lS9hk7dvvQ5xKScA-1)

**App Outline:** [Lucid Chart](https://lucid.app/lucidchart/0acb1c8e-a834-45c1-968c-c90e666027a9/edit?invitationId=inv_150ff306-57ce-496f-81bb-c18887997127&page=0_0#)

## Features  
- Personalized information based off of your current situation
- Trivias to test your knowledge
- FAQs for easy access information

## How to Start
### Prerequisites
- Node.js 
- Expo CLI
- Expo Go app (For running on your phone)

### Steps
1. **Clone the Repository**  
   ```bash
   git clone <your-repo-url>
   cd catAdoptionApp

2. **Install Dependencies**
   ```bash
   npm install

3. **Start the Development Server**
   ```bash
   npm run ios

4. **Run the App on Your Phone**
- Open the Expo Go app
- Scan the QR code shown in your terminal or browser
- The app should open directly on your device

**How to Change FAQs:** 
- Go to app/(tabs)/Categories/thinkingOfAdopting.tsx
- Change the list right under the comment that says: CHANGE THE FAQs OVER HERE
- It will be in the form of ['This is where you put the question', 'This is where you put the answer']
