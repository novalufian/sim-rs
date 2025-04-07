const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Selemat Pagi';
    if (currentHour < 15) return 'Selamat Siang';
    if (currentHour < 17) return 'Selamat Sore';
    return 'Selamat Malang';
};

export default getGreeting;