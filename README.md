# Cat Adoption App

## Project Description:
CatWise is your all-in-one resource for cat adoption, created with React Native. Whether you're considering adoption, new to cats, an experienced cat parent, or simply a cat lover, CatWise is your trusted companion for finding, adopting, and caring for cats.

#  Summary
- [Demo](#Demo)
- [App Screenshots](#App-Screenshots)
- [Features](#Features)
- [Tech Stack](#Tech-Stack)
- [APIs](#APIs)
- [Support](#Support)
- [Privacy Policy](#Privacy-Policy)

## Demo
- **App Store:** https://apps.apple.com/us/app/catwise/id6772019033
- **Youtube Link:** [https://youtube.com/shorts/cos28Tr-IbI](https://www.youtube.com/shorts/iBNfsPolkwY)

### App Screenshots

<p align="center">
  <img width="220" alt="image" src="https://github.com/user-attachments/assets/c50625fd-9ad3-460d-9dba-b2e49c90e282" />
</p>
<p align="center">
  <img width="220" alt="image" src="https://github.com/user-attachments/assets/f61dac87-5439-4f4e-b8a8-79599159ffa2" />
</p>
<p align="center">
  <img width="220" alt="image" src="https://github.com/user-attachments/assets/b64d2a43-24d1-4c0f-bc04-93feb640fb69" />
</p>
<p align="center">
  <img width="220" alt="image" src="https://github.com/user-attachments/assets/f227b982-2e72-4791-9d7d-7255a7d061f8" />
</p>
<p align="center">
  <img width="220" alt="image" src="https://github.com/user-attachments/assets/86436741-7421-4dbd-a746-e00abcbe4549" />
</p>

## Features
- **Interactive Quizzes**: Trivia with instant answer checking, confetti feedback, and animated progress bars
- **Flip Card Flashcards**: Swipeable cards with cat illustrations and detailed back content
- **Gamification**: Game-style UI to learn which foods, plants, and household items are dangerous to cats
- **Cat Stories**: User-submitted stories that connect cat lovers through shared experiences
- **Cat Shelter Finder**: Location-based shelter finder that displays nearby cat shelters using the user’s real-time location

## Tech Stack
- React Native
- Expo
- TypeScript
- Express
- Supabase

## APIs
#### CreateStory
`POST /api/stories`
Request
~~~
name: str (optional)
cat_name: str
how_met: str (optional)
cat_description: str (optional)
memorable_story: str (optional)
best_part: str (optional)
photos: list[str] (optional)
~~~
Response
~~~
story: dict
~~~
#### GetApprovedStories
`GET /api/stories`
Response
~~~
stories: [dict]
~~~
#### UploadPhoto
`POST /api/stories/photos`
Request
~~~
file: File
~~~
Response
~~~
url: str
~~~
#### NotifyModerator
`POST /api/stories/notify`
Request
~~~
cat_name: str
name: str
~~~
Response
~~~
ok: bool
~~~
#### SearchShelters
`GET /api/shelters`
Request
~~~
query: str
lat: str
lng: str
~~~
Response
~~~
shelters: [dict]
searchedLocality: str
~~~

## Support
**Support URL**: https://cat-wise-support-page.vercel.app/
## Privacy Policy
**Privacy Policy URL**: https://cat-wise-support-page.vercel.app/privacy
