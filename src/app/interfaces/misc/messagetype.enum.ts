/*
    Written by: Ryan Kruse
    This enum MessageType is used for the toasters (popups) that are shown when the user does a transaction with our DB.
    Success -> The transaction was successful
    Failure -> The transaction failed
    Notification -> The transaction was successful, but has no side-effects
*/
export enum MessageType {
    Success,
    Failure,
    Notification
}