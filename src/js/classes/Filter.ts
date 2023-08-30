import { Comments } from "./Comments";
import { Comment } from "./Comment";

export class Filter {
	public updateCountComments(): void {
		const comments: Comment[] = JSON.parse(localStorage.getItem('comments') || '{}');
		const filterCommentsNum: HTMLElement = document.querySelector('.filter__btn-num') as HTMLElement;
		filterCommentsNum.innerHTML = '';
		filterCommentsNum.innerHTML = `${comments.length}`;
	}

	public clickBtn(): void {
		const buttonsContainer: HTMLElement = document.querySelector('.filter') as HTMLElement;
		buttonsContainer?.addEventListener('click', handleButtonClick);

		function handleButtonClick(event: Event) {
			const target = event.target as HTMLElement;
			if (target.classList.contains('filter__btn--comments')) {
				showComments(target);
			}
			if (target.classList.contains('filter__btn--favorites')) {
				showFavorites(target);
			}
			if (target.classList.contains('selection__btn--totgglesort')) {
				toggleAscending(event)
			}
		}

		function showComments(button: HTMLElement) {
			button.classList.add('active');
			document.querySelector('.filter__btn--favorites')?.classList.remove('active');
			new Comments().showComments(false, 'date', false);
		}

		function showFavorites(button: HTMLElement) {
			button.classList.add('active');
			document.querySelector('.filter__btn--comments')?.classList.remove('active');
			new Comments().showComments(true, 'date', false);
		}

		function toggleAscending(event: Event) {
			const target = event.target as HTMLElement;
			let type: string = '';
			type = (document.querySelector('.selection__btn--totgglelist') as HTMLElement).dataset.type as string;
			const favoriteStatus: boolean = document.querySelector('.filter__btn--favorites')?.classList.contains('active') as boolean;
			if (target.classList.contains('active')) {
				target.classList.remove('active');
				target.dataset.ascending = 'false';
				new Comments().showComments(favoriteStatus, type, false)
			} else {
				target.classList.add('active');
				target.dataset.ascending = 'true';
				type = (document.querySelector('.selection__btn--totgglelist') as HTMLElement).dataset.type as string;
				new Comments().showComments(favoriteStatus, type, true)
			}
		}
	}

	public toggleRatingList(): void {
		const selection: HTMLElement = document.querySelector('.selection') as HTMLElement;
		selection.addEventListener('click', toggleList);

		function toggleList(event: Event): void {
			const target = event.target as HTMLElement;
			const selectionList: HTMLElement = document.querySelector('.selection__list') as HTMLElement;

			if (target.classList.contains('selection__btn--totgglelist')) {
				if (selectionList.classList.contains('active')) {
					selectionList.classList.remove('active');
				} else {
					selectionList.classList.add('active');
				}
			}

			document.querySelectorAll('.selection__list-item').forEach(item => {
				item.addEventListener('click', (event) => {
					event.stopImmediatePropagation();
					document.querySelectorAll('.selection__list-item').forEach(item => {
						item.classList.remove('active')
					})
					if (!item.classList.contains('active')) {
						item.classList.add('active');
					}
					selectionList.classList.remove('active');
					document.querySelector('.selection__btn')?.classList.remove('actived');
					const btn: HTMLElement = (item.closest('.selection__item') as HTMLElement).querySelector('.selection__btn span') as HTMLElement;
					const span: HTMLElement = item.querySelector('span') as HTMLElement;
					btn.textContent = span.textContent;

					const type: string = (item as HTMLElement).dataset.type as string;
					btn.dataset.type = type;

					const ascendingHTML: HTMLElement = document.querySelector('.selection__btn--totgglesort') as HTMLElement;
					const ascending: boolean = JSON.parse(ascendingHTML.dataset.ascending || "null") as boolean;

					const favoriteStatus: boolean = document.querySelector('.filter__btn--favorites')?.classList.contains('active') as boolean;

					new Comments().showComments(favoriteStatus, type, ascending)
				});
			});
		}
	}

	private templateRatingList(): string {
		return `
			<div class="selection">
				<div class="selection__item">
					<div class="selection__btn"><span class="selection__btn--totgglelist" data-type="date">По дате</span><svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="selection__btn--totgglesort" data-ascending="false"><path d="M9 15L17.6603 0H0.339746L9 15Z" fill="black"/></svg></div>
					<div class="selection__list"> 
						<div class="selection__list-item active" data-type="date">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" inkscape:version="0.48.4 r9939" width="800px" height="800px" viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve"><path inkscape:connector-curvature="0" d="M1004.237,99.152l-611.44,611.441L194.492,512.288L0,706.779  l198.305,198.306l195.762,195.763L588.56,906.355L1200,294.916L1004.237,99.152z"/></svg>
							<span>По дате</span>
						</div>
						<div class="selection__list-item" data-type="rating">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" inkscape:version="0.48.4 r9939" width="800px" height="800px" viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve"><path inkscape:connector-curvature="0" d="M1004.237,99.152l-611.44,611.441L194.492,512.288L0,706.779  l198.305,198.306l195.762,195.763L588.56,906.355L1200,294.916L1004.237,99.152z"/></svg>
							<span>По количеству оценок</span>
						</div>
						<div class="selection__list-item" data-type="replies">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" inkscape:version="0.48.4 r9939" width="800px" height="800px" viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve"><path inkscape:connector-curvature="0" d="M1004.237,99.152l-611.44,611.441L194.492,512.288L0,706.779  l198.305,198.306l195.762,195.763L588.56,906.355L1200,294.916L1004.237,99.152z"/></svg>
							<span>По количеству ответов</span>
						</div>
					</div>
				</div>
			</div>
		`
	}

	public render(): string {
		return `
		<div class="filter">
			<div class="filter__btn filter__btn--comments active">
				<div class="filter__btn-title">Комментарии</div>
				<div class="filter__btn-dop">(<span class="filter__btn-num">0</span>)</div>
			</div>
			${this.templateRatingList()}
			<div class="filter__btn filter__btn--favorites">
				<div class="filter__btn-title">Избранное</div>
				<div class="filter__btn-dop"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" width="800px" height="800px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g><path d="M310.75,144c-21.875,0-41.375,10.078-54.75,25.766C242.5,154.078,223,144,201.125,144C160.75,144,128,177.422,128,218.625 C128,312,256,368,256,368s128-56,128-149.375C384,177.422,351.25,144,310.75,144z"/><path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472 c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"/></g></svg></div>
			</div>
		</div>
		`
	}
}