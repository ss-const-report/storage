export function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Check if date is valid
        return '';
    } else {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
}

export const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

export function toggleElement(): void {
    const checkbox: HTMLInputElement | null = document.getElementById('checkbox-1') as HTMLInputElement;
    const element: HTMLElement | null = document.getElementById('additional-element');

    if (checkbox && element) {
        element.style.display = checkbox.checked ? 'block' : 'none';
    }
}