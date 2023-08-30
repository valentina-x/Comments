import { IReplyData } from './IComment';

export class Comment {
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

	constructor(commentData: { id: number | string, name: string, text: string, photo: string, rating: number, isFavorite: boolean, isReply: boolean, date: string, time: string, counterReplies: number, replyData: IReplyData }) {
		const { id, name, text, photo, rating, isFavorite, isReply, date, time, counterReplies, replyData } = commentData;
		this.text = text;
		this.id = id;
		this.name = name;
		this.photo = photo;
		this.rating = rating;
		this.isFavorite = isFavorite;
		this.isReply = isReply;
		this.date = date;
		this.time = time;
		this.counterReplies = counterReplies;
		this.replyData = {
			id: replyData.id,
			name: replyData.name,
		}
	}

	render(isFavorites: boolean): string {
		return `
		<div class="comment${this.isReply ? ' comment--answer' : ''}${isFavorites ? ' comment--favorite' : ''}" id="${this.id}">
			<div class="comment__avatar"><img src="${this.photo}" alt="ava${this.id}" width="61" height="61"></div>
			<div class="comment__info">
				<div class="comment__name">${this.name}</div>
				<div class="comment__button comment__button--replyname ${!this.isReply ? 'hidden' : ''}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="800px" width="800px" version="1.1" id="Layer_1" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><path d="M185.2,128.6V19.7L0,204.9l185.2,185.2V281.1c152.5,0,250.5,0,326.8,217.9C512,390.1,522.9,128.6,185.2,128.6z"/></svg> ${this.replyData.name}</div>
				<div class="comment__date">${this.date} ${this.time}</div>
				<div class="comment__text">${this.text}</div>
				<div class="comment__button comment__button--answer ${this.isReply || isFavorites ? 'hidden' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="800px" width="800px" version="1.1" id="Layer_1" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><path d="M185.2,128.6V19.7L0,204.9l185.2,185.2V281.1c152.5,0,250.5,0,326.8,217.9C512,390.1,522.9,128.6,185.2,128.6z"/></svg>
					Ответить
				</div>
				<div class="comment__button comment__button--favorite${this.isFavorite ? ' active' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" fill="transparent" stroke="#222222" stroke-width="2"/></svg>
					<span>${this.isFavorite ? 'В избранном' : 'В избранное'}</span>
				</div>
				<div class="comment__button comment__button--rate">
					<button class="comment__button-rate comment__button-rate--minus">-</button>
					<span class="comment__button-num" ${this.rating >= 0 ? ' style="color: #8AC540;"' : ' style="color: red;"'}>${this.rating}</span>
					<button class="comment__button-rate comment__button-rate--plus">+</button>
				</div>
			</div>
		</div>
		`;
	}
}