export {};

declare global {          // У TS інтерфейси додаються - два означення
    interface Date {      // одного інтерфейсу розширюють один іншого    
        toDotted: () => string,
        toApiDate: () => string,
    }
}

Date.prototype.toDotted = function(): string {
    return `${this.getDate().pad2()}.${(this.getMonth() + 1).pad2()}.${this.getFullYear()}`;
}
Date.prototype.toApiDate = function(): string {
    const dd = this.getDate().pad2();
    const mm = (this.getMonth() + 1).pad2();
    const yyyy = this.getFullYear();
    return`${yyyy}${mm}${dd}`;
}