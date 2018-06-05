import { MessageType } from '../misc/messagetype.enum';

export interface MessageOutput{
    message: string,
    action: string,
    level: MessageType
}