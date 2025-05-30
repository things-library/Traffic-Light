class ThingItem {
    constructor(type, name = null, date = null, tags = {}) {
        if (!type || type.trim().length === 0) {
            throw new Error("Type must be a non-empty string");
        }

        this.date = date;
        this.type = type;
        this.name = name;
        this.tags = tags;
        this.items = {};
    }

    get(key) {
        return this.tags.hasOwnProperty(key) ? this.tags[key] : null;
    }

    set(key, value) {
        this.tags[key] = value;
    }

    sentence() {
        const parts = [`$${this.date}`, this.type];
        for (const key in this.tags) {
            parts.push(`${key}:${this.tags[key]}`);
        }
        const sentence = parts.join("|");
        const checksum = ThingItem.checksum(sentence);
        return `${sentence}*${checksum}`;
    }

    static checksum(sentence) {
        if (!sentence || sentence[0] !== '$') {
            console.error('Invalid Sentence:', sentence);
            return null;
        }

        let checksum = sentence.charCodeAt(1);
        for (let i = 2; i < sentence.length; i++) {
            if (sentence[i] === '*') break;
            checksum ^= sentence.charCodeAt(i);
        }

        return checksum.toString(16).toUpperCase().padStart(2, '0');
    }

    static parseJson(json) {
        if (!json.type) {
            throw new Error("Telemetry sentence is null or whitespace");
        }

        const { type, name = null, date = null, tags = {}, items = {} } = json;
        const item = new ThingItem(type, name, date, tags);

        for (const subitem in items) {
            item.items[subitem] = ThingItem.parseJson(items[subitem]);
        }

        return item;
    }

    static parse(sentence) {
        if (!sentence || sentence.length === 0) {
            throw new Error("Telemetry sentence is null or whitespace");
        }

        if (!ThingItem.validateChecksum(sentence)) {
            const checksum = ThingItem.toChecksum(sentence);
            throw new Error(`Invalid checksum. Expected: '${checksum}'`);
        }

        const num = sentence.lastIndexOf('*');
        if (num === -1) {
            throw new Error("Missing checksum delimiter '*'");
        }

        const content = sentence.slice(1, num);
        const parts = content.split('|');
                
        const item = new ThingItem(parts[1], null, parts[0]);
        for (let i = 2; i < parts.length; i++) {
            const [key, value] = parts[i].split(':', 2);
            if (key && value !== undefined) {
                item.tags[key] = value;
            }
        }

        return item;
    }

    static appendChecksum(sentence) {
        if (!sentence || sentence[0] !== '$') return sentence;

        let checksum = sentence.charCodeAt(1);
        for (let i = 2; i < sentence.length; i++) {
            if (sentence[i] === '*') break;
            checksum ^= sentence.charCodeAt(i);
        }

        if (!sentence.includes('*')) {
            sentence += '*';
        }

        return sentence + checksum.toString(16).toUpperCase().padStart(2, '0');
    }

    static toChecksum(sentence) {
        if (!sentence || sentence[0] !== '$') return '';

        let checksum = sentence.charCodeAt(1);
        for (let i = 2; i < sentence.length; i++) {
            if (sentence[i] === '*') break;
            checksum ^= sentence.charCodeAt(i);
        }

        return checksum.toString(16).toUpperCase().padStart(2, '0');
    }

    static validateChecksum(sentence) {
        const checksum = ThingItem.toChecksum(sentence);
        return checksum && sentence.endsWith(checksum);
    }
}


// Assuming ThingItem is already defined or imported

class Telemetry {
    constructor() {
        this.events = {};
        this.sequence = 0;
    }

    add(event) {
        if (!this.events.hasOwnProperty(event.type)) {
            this.events[event.type] = [];
        }

        if (event.sequence === null || event.sequence === undefined) {
            event.sequence = this.sequence;
            this.sequence += 1;
        }

        this.events[event.type].push(event);
    }
}

class TelemetryEvent extends ThingItem {
    constructor(type, date = null, sequence = null, tags = {}) {
        if (date === null) {
            date = Math.floor(Date.now() / 1000); // current epoch time in seconds
        }

        super(type, null, date, tags);
        this.sequence = sequence;
    }

    static parse(sentence) {        
        const item = ThingItem.parse(sentence);
        return new TelemetryEvent(item.type, item.date, null, item.tags);
    }
}

