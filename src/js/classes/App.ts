import { Filter } from './Filter';
import { Form } from './Form';

export class App {
	private filter: Filter;
	private form: Form;
	private app: HTMLElement;

	constructor() {
		this.app = document.getElementById('app') as HTMLElement;
		this.filter = new Filter();
		this.form = new Form();
	}

	init(): void {
		// add mock data
		this.form.comments.addMockToLocalStorage();

		// add filter panel to app
		this.app.insertAdjacentHTML('afterbegin', this.filter.render());
		this.filter.updateCountComments();
		this.filter.clickBtn();
		this.filter.toggleRatingList();

		// add form
		const filter: HTMLElement = this.app.querySelector('.filter') as HTMLElement;
		this.form.initForm(filter, false);

		// add comments
		this.app.insertAdjacentHTML('beforeend', this.form.comments.render());
		setTimeout(() => {
			this.form.comments.showComments(false, 'date', false);
		}, 100);
	}
}