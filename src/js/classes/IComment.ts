export interface IComment {
	id: number | string;
	name: string;
	text: string;
	photo: string;
	rating: number;
	isFavorite: boolean;
	isReply: boolean;
	date: string;
	time: string;
	counterReplies: number;
	replyData: IReplyData;
}

export interface IReplyData {
	id: number | string;
	name: string;
}