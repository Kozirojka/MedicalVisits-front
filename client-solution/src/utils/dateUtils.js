export const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Не вказано';
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date) + ' р.';
};