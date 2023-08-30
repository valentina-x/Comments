export class User {
	private id: number;
	private username: string;
	private photoURL: string;

	constructor(id: number, username: string) {
		this.id = id;
		this.username = username;
		this.photoURL = './src/images/avatar4.jpg';
	}

	public getId(): number {
		return this.id;
	}

	public getUsername(): string {
		return this.username;
	}

	public getPhotoURL(): string {
		return this.photoURL;
	}
}