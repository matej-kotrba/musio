import { Icon } from "@iconify-icon/solid";

const features = [
  {
    icon: <Icon icon="majesticons:music" class="h-8 w-8 text-primary" />,
    title: "Vast Song Library",
    description: "Access millions of songs across various genres and eras.",
  },
  {
    icon: <Users class="h-8 w-8 text-[#8eff4d]" />,
    title: "Multiplayer Fun",
    description: "Compete with friends in real-time, no matter where they are.",
  },
  {
    icon: <Mic class="h-8 w-8 text-[#8eff4d]" />,
    title: "Karaoke Mode",
    description: "Sing along with on-screen lyrics after guessing the song.",
  },
  {
    icon: <Headphones class="h-8 w-8 text-[#8eff4d]" />,
    title: "Custom Playlists",
    description: "Create themed music quizzes from your favorite tracks.",
  },
  {
    icon: <Play class="h-8 w-8 text-[#8eff4d]" />,
    title: "Quick Rounds",
    description: "Perfect for parties with fast-paced, exciting gameplay.",
  },
  {
    icon: <Trophy class="h-8 w-8 text-[#8eff4d]" />,
    title: "Leaderboards",
    description: "Track your progress and compete for the top spot.",
  },
  {
    icon: <Zap class="h-8 w-8 text-[#8eff4d]" />,
    title: "Power-Ups",
    description: "Use special abilities to gain an edge in the game.",
  },
  {
    icon: <BarChart class="h-8 w-8 text-[#8eff4d]" />,
    title: "Music Stats",
    description: "Analyze your music knowledge and listening habits.",
  },
];

export default function Features() {
  return (
    <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="container mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
          Why Choose <span class="text-[#8eff4d]">Musio</span>?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              class="bg-[#3a3a3a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div class="mb-4">{feature.icon}</div>
              <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
              <p class="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
