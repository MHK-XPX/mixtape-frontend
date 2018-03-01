import { MessageType } from '../shared/messagetype.enum';

export interface MessageOutput{
    message: string,
    level: MessageType
}