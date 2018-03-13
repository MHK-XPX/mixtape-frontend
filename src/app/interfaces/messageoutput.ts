import { MessageType } from '../shared/messagetype.enum';

export interface MessageOutput{
    message: string,
    action: string,
    level: MessageType
}