# 🎉 spaBBV Countdown 2026

The official New Year countdown application for the BBV School Student Council. A premium, aesthetic, and highly responsive web experience designed to welcome 2026 in style.

![Countdown Preview](/public/logo.png)

## ✨ key Features

-   **🌏 Precision Timezone**: Hardcoded to **Thailand Time (UTC+7)**. The countdown hits midnight strictly at Thai New Year, regardless of where the user opens the website.
-   **⚡ Giant Mode**: In the final minute (when days, hours, minutes are all 0), the interface transforms. The seconds display expands to fill the entire screen (`~30vw`) with a golden glow for maximum hype.
-   **🔊 Immersive Sound**:
    -   **Ticking**: Plays a suspenseful tick sound during the final 10 seconds.
    -   **Celebration**: Plays a grand fireworks sound effect **3 times** (at 0s, 2s, and 4s) when the clock hits midnight.
-   **🎆 Visual Effects**:
    -   Dynamic **Fireworks** animation using `canvas-confetti`.
    -   **Glitter** particles for extra sparkle.
    -   Smooth animations powered by `framer-motion`.
-   **📱 Fully Responsive**: Optimized for every screen size, from small smartphones to large desktop monitors.
-   **👥 Live Community**: Shows a simulated "Live Watching" count to create a sense of shared experience.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Particles**: [canvas-confetti](https://github.com/catdad/canvas-confetti)
-   **Backend**: [Supabase](https://supabase.com/) (For storing user wishes)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/countdownwithspabbv.git
    cd countdownwithspabbv
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

-   `src/app/page.tsx`: Main application logic (Countdown, Giant Mode, Sounds).
-   `public/sounds/`: Contains `tick.mp3` and `firework.mp3` audio files.
-   `src/lib/supabase.ts`: Supabase client configuration.

## 🎵 Sound Credits

-   **Tick Sound**: Standard clock tick effect.
-   **Firework Sound**: Celebration explosion effect.

---

Developed with ❤️ by **Antigravity** for **BBV School Student Council**.
Happy New Year 2026! 🎊
