import { Comment } from './Comment';
import { Form } from './Form';
import { IComment } from './IComment';

export class Comments {
	private target: HTMLElement | null;
	private targetParent: HTMLElement | null;

	constructor() {
		this.target = null;
		this.targetParent = null;
	}

	public render(): string {
		return `
			<div class="comments" id="comments"></div>
		`
	}

	public addMockToLocalStorage(): void {
		fetch('./Comments.json')
			.then(response => response.json())
			.then(data => {
				const commentsFromFile: Comment[] = data;
				const commentsFromLocalStorage: Comment[] = JSON.parse(localStorage.getItem('comments') || '[]');

				commentsFromFile.map((comment) => {
					comment.photo = '';
					comment.photo = generateAvatar(comment.name);
				});
		
				if (commentsFromLocalStorage.length === 0) {
					localStorage.setItem('comments', JSON.stringify(commentsFromFile));
				} else {
					commentsFromLocalStorage.push(data);
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});

		function generateAvatar(name: string): string {
			return `https://avatar.oxro.io/avatar.svg?name=${name}`;
		}
	}

	public showComments(isFavorites: boolean, sort: string, ascending = false): void {
		const comments: string | null = localStorage.getItem('comments');
		const commentsWrap: HTMLElement = document.getElementById('comments') as HTMLElement;
		commentsWrap.innerHTML = '';

		if (comments !== null) {
			let parsedComments: Comment[] = JSON.parse(comments);

			if (isFavorites) {
				setTimeout(() => {
					const commentsElements: NodeListOf<Element> = document.querySelectorAll("#comments .comment");
					const commentIds: string[] = [];
					commentsElements.forEach((commentElement) => {
						const commentId = commentElement.id;
						commentIds.push(commentId);
					});

					let comments: Comment[] = [];
					commentIds.forEach((commentId) => {
						const storedComment = JSON.parse(localStorage.getItem(commentId) || '[]');
						if (storedComment) {
							comments.push(storedComment);
						}
					});

					parsedComments = comments;
				}, 200);
			}

			if (sort) {
				this.sort(parsedComments, sort, ascending);
			}

			parsedComments.forEach(function (comment: IComment): void {
				if (isFavorites) {
					if (comment.isFavorite) {
						commentsWrap.innerHTML += new Comment(comment).render(isFavorites);
					}
				} else {
					if (comment.isReply) {
						setTimeout(() => {
							const el: HTMLElement = document.getElementById(`${comment.replyData.id}`) as HTMLElement;
							el.insertAdjacentHTML("afterend", new Comment(comment).render(isFavorites));
						}, 100);
					} else {
						commentsWrap.innerHTML += new Comment(comment).render(isFavorites);
					}
				}
			});

			setTimeout(() => {
				this.addHandlersToButtons();
			}, 100);
		}
	}

	private addHandlersToButtons(): void {
		const commentsHTML: NodeListOf<Element> = document.querySelectorAll('.comment');
		commentsHTML.forEach(comment => {
			const replyBtn: HTMLElement = comment.querySelector('.comment__button--answer') as HTMLElement;
			const favoriteBtn: HTMLElement = comment.querySelector('.comment__button--favorite') as HTMLElement;
			const ratingBtn: NodeListOf<Element> = comment.querySelectorAll('.comment__button-rate');
			replyBtn.addEventListener('click', this.createFormReply.bind(this));
			favoriteBtn.addEventListener('click', this.toggleFavorite.bind(this));
			ratingBtn.forEach(btn => {
				btn.addEventListener('click', this.calcRating.bind(this));
			});
		})
	}

	public sort(comments: Comment[], sort: string, ascending: boolean = true) {
		event?.stopImmediatePropagation()
		if (!sort) return;

		return comments.sort((a, b) => {
			if (ascending) {
				if (sort === 'date') {
					const dateComparison = +a.date - +b.date;
					if (dateComparison === 0) {
						return a.time.localeCompare(b.time);
					}
					return dateComparison;
				}
				if (sort === 'rating') {
					if (a.isReply || b.isReply) {
						if (a.rating < 0 || b.rating < 0) {
							return - a.rating + b.rating;
						} else {
							return b.rating - a.rating;
						}
					} else {
						if (a.rating < 0 && b.rating < 0) {
							return b.rating - a.rating;
						} else {
							return a.rating - b.rating;
						}
					}
				}
				if (sort === 'replies') { return a.counterReplies - b.counterReplies; }

			} else {
				if (sort === 'date') {
					const dateComparison = +b.date - +a.date;
					if (dateComparison === 0) {
						return b.time.localeCompare(a.time);
					}
					return dateComparison;
				}
				if (sort === 'rating') {
					if (a.isReply || b.isReply) {
						if (a.rating < 0 || b.rating < 0) {
							return - b.rating + a.rating;
						} else {
							return a.rating - b.rating;
						}
					} else {
						if (a.rating < 0 && b.rating < 0) {
							return a.rating - b.rating;
						} else {
							return b.rating - a.rating;
						}
					}
				}
				if (sort === 'replies') { return b.counterReplies - a.counterReplies; }
			}
			return 0;
		});
	}

	private getCommentHTMLElement(event: Event): void {
		this.target = event?.target as HTMLElement;
		this.targetParent = this.target?.closest('.comment') as HTMLElement;
	}

	private createFormReply = (event: Event): void => {
		this.getCommentHTMLElement(event);
		new Form().initForm(this.targetParent as HTMLElement, true);
	}

	public countReplies(id: string): void {
		this.updateCountRepliesInLocalStorage(id)
	}

	private toggleFavorite = (event: Event): void => {
		this.getCommentHTMLElement(event);
		const favoriteTextHTML: HTMLElement = (this.target as HTMLElement).querySelector('span') as HTMLElement;
		if ((this.target as HTMLElement).classList.contains('active')) {
			(this.target as HTMLElement).classList.remove('active');
			favoriteTextHTML.innerHTML = '';
			favoriteTextHTML.innerHTML = 'В избранное';
			this.updateFavoriteInLocalStorage((this.targetParent as HTMLElement).id, false)
		} else {
			(this.target as HTMLElement).classList.add('active');
			favoriteTextHTML.innerHTML = '';
			favoriteTextHTML.innerHTML = 'В избранном';
			this.updateFavoriteInLocalStorage((this.targetParent as HTMLElement).id, true)
		}
	}

	private calcRating = (event: Event): void => {
		this.getCommentHTMLElement(event);

		const ratingBtn: HTMLElement = event.target as HTMLElement;
		const numHTML: HTMLElement = (this.targetParent as HTMLElement).querySelector('.comment__button-num') as HTMLElement;

		enum Rating {
			Min = 0,
			Step = 1,
		}

		let currentRating: number = +numHTML.innerHTML;
		let currentRatingCalc: number = Rating.Min;

		if (ratingBtn.classList.contains('comment__button-rate--minus')) {
			currentRating = +numHTML.innerHTML;
			if (currentRatingCalc - currentRating != Rating.Step) {
				currentRatingCalc = currentRating - Rating.Step;
			} else {
				ratingBtn.setAttribute('style', 'pointer-events: none');
			}
			if (currentRatingCalc < Rating.Min) {
				numHTML.setAttribute('style', 'color: red;');
			}
			ratingBtn.setAttribute('style', 'pointer-events: none');

			updateRatingHTML(currentRatingCalc);
			this.updateRatingInLocalStorage((this.targetParent as HTMLElement).id, currentRatingCalc)
		}

		if (ratingBtn.classList.contains('comment__button-rate--plus')) {
			currentRating = +numHTML.innerHTML;
			currentRatingCalc = +numHTML.innerHTML;
			if (currentRatingCalc - currentRating != Rating.Step) {
				currentRatingCalc = currentRating + Rating.Step;
			} else {
				ratingBtn.setAttribute('style', 'pointer-events: none');
			}
			if (currentRatingCalc >= Rating.Min) {
				numHTML.setAttribute('style', 'color: #8AC540;');
			}
			ratingBtn.setAttribute('style', 'pointer-events: none');
			updateRatingHTML(currentRatingCalc);
			this.updateRatingInLocalStorage((this.targetParent as HTMLElement).id, currentRatingCalc);
		}

		function updateRatingHTML(rating: number): void {
			numHTML.innerHTML = '';
			numHTML.innerHTML = rating.toString();
		}
	}

	private updateRatingInLocalStorage(id: string, rating: number) {
		const comments: Comment[] = JSON.parse(localStorage.getItem('comments') || '{}');

		comments.forEach(function (comment: Comment, index: number): void {
			if (comment.id == id) {
				comment.rating = rating;
				comments[index] = comment;
				localStorage.setItem('comments', JSON.stringify(comments));
			}
		});
	}

	private updateFavoriteInLocalStorage(id: string, isFavorite: boolean) {
		const comments: Comment[] = JSON.parse(localStorage.getItem('comments') || '{}');

		comments.forEach(function (comment: Comment, index: number): void {
			if (comment.id == id) {
				comment.isFavorite = isFavorite;
				comments[index] = comment;
				localStorage.setItem('comments', JSON.stringify(comments));
			}
		});
	}

	private updateCountRepliesInLocalStorage(id: string) {
		const comments: Comment[] = JSON.parse(localStorage.getItem('comments') || '{}');

		comments.forEach(function (comment: Comment, index: number): void {
			if (comment.id == id) {
				comment.counterReplies++;
				comments[index] = comment;
				localStorage.setItem('comments', JSON.stringify(comments));
			}
		});
	}
}