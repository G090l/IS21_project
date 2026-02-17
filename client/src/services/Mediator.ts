type EventHandler = (data?: any) => Promise<any> | any;
type TriggerHandler = (data?: any) => Promise<any> | any;

interface EventsMap {
    [key: string]: EventHandler[];
}

interface TriggersMap {
    [key: string]: TriggerHandler | null;
}

interface MediatorConfig<TEvents, TTriggers> {
    EVENTS: TEvents;
    TRIGGERS: TTriggers;
}

class Mediator<TEvents extends Record<string, string>, TTriggers extends Record<string, string>> {
    private events: EventsMap;
    private triggers: TriggersMap;
    public readonly EVENTS: TEvents;
    public readonly TRIGGERS: TTriggers;

    constructor({ EVENTS, TRIGGERS }: MediatorConfig<TEvents, TTriggers>) {
        this.events = {};
        this.triggers = {};
        this.EVENTS = EVENTS;
        this.TRIGGERS = TRIGGERS;

        Object.keys(EVENTS).forEach(key => {
            this.events[this.EVENTS[key] as string] = [];
        });

        Object.keys(TRIGGERS).forEach(key => {
            this.triggers[this.TRIGGERS[key] as string] = null;
        });
    }

    public getEventTypes(): TEvents {
        return this.EVENTS;
    }

    public subscribe(name: string, func: EventHandler): void {
        if (this.events[name] && func instanceof Function) {
            this.events[name].push(func);
        }
    }

    public async call(name: string, data?: any): Promise<any> {
        if (this.events[name]) {
            const event = this.events[name][0];
            if (event instanceof Function) {
                return await event(data);
            }
        }
        return null;
    }

    public unsubscribe(name: string, _func: EventHandler): void {
        if (!this.events[name]) return;

        const handlerEntry = this.events[name]
            .map((func, i): [EventHandler, number] => [func, i])
            .filter(([func]) => func === _func)[0];

        if (handlerEntry) {
            this.events[name].splice(handlerEntry[1], 1);
        }
    }

    public unsubscribeAll(name?: string): void {
        if (name) {
            this.events[name] = [];
        } else {
            Object.keys(this.events).forEach(key => {
                this.events[key] = [];
            });
        }
    }

    public getTriggerTypes(): TTriggers {
        return this.TRIGGERS;
    }

    public set(name: string, func: TriggerHandler): void {
        if (this.triggers.hasOwnProperty(name) && func instanceof Function) {
            this.triggers[name] = func;
        }
    }

    public async get(name: string, data?: any): Promise<any> {
        const trigger = this.triggers[name];
        if (trigger && trigger instanceof Function) {
            return await trigger(data);
        }
        return null;
    }
}

export default Mediator;