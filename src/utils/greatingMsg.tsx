const getGreeting = (): string => {
    const hour = new Date().getHours() // optionally adjust for timezone
    // Or use Intl to get time in a specific locale
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 17) return 'Selamat Sore'
    return 'Selamat Malam'
}  

export default getGreeting