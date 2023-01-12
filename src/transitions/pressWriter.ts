export function pressWriter(node: HTMLElement, {speed}: { speed: number}):
        {duration: number, tick: (t: number) => void} {

    const isValid = (
        node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE
    );
  
    if (!isValid) {
        throw new Error('Please provide plain text')
    }
  
    const text: string = node.textContent;
    const duration: number = text.length * speed;
  
    return {
        duration,
        // t Изменяется от 0 до 1 (за время duration)
        tick: (t: number) => {
            // Чем больше t, тем больше букв
            const i: number = Math.round(text.length * t);
            node.textContent = text.slice(0, i);
        } 
    }
}
