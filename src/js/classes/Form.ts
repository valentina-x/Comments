import { User } from "./User";
import { Comments } from "./Comments";
import { IComment } from "./IComment";
import { v4 as uuidv4 } from "uuid";
import { Filter } from "./Filter";

export class Form {
  private user: User;
  private data: IComment;
  public comments: Comments;

  constructor() {
    this.user = new User(1, "Алекс");
    this.data = {
      id: uuidv4(),
      name: this.user.getUsername(),
      text: "",
      photo: this.user.getPhotoURL(),
      rating: 0,
      isFavorite: false,
      isReply: false,
      date: this.getDateNow(),
      time: this.getTimeNow(),
      counterReplies: 0,
      replyData: {
        id: "",
        name: "",
      },
    };
    this.comments = new Comments();
  }

  private render(reply: boolean): string {
    this.data.isReply = reply;
    return `
			<form class="form form--comment${reply ? " form--answer" : ""}">
				<div class="form__avatar"><img src="${this.user.getPhotoURL()}" alt="ava" width="61" height="61"></div>
				<div class="form__txtblock">
					<div class="form__name">${this.user.getUsername()}</div>
					<div class="form__limit"><span>Макс. 1000 символов</span></div>
					<textarea class="form__textarea" name="text" placeholder="Введите текст сообщения..." maxlength="1100" contenteditable></textarea>
				</div>
				<input class="form__send" type="submit" value="Отправить" disabled>
				<input type="text" value="" hidden>
			</form>
		`;
  }

  private getContext(event: Event): EventTarget | null {
    return event.target;
  }

  private getFormContext(context: Function, e: Event): HTMLFormElement {
    return context(e).closest("form") as HTMLFormElement;
  }

  private autoResizeTextarea = (event: Event): void => {
    const target: HTMLTextAreaElement = this.getContext(
      event
    ) as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
    this.checkLimitTextarea(target);
  };

  private checkLimitTextarea = (target: HTMLTextAreaElement): void => {
    const formParent: HTMLFormElement = target.closest(
      "form"
    ) as HTMLFormElement;
    const limitHTML: HTMLElement = formParent?.querySelector(
      ".form__limit span"
    ) as HTMLElement;
    const sendBtn: HTMLButtonElement = formParent?.querySelector(
      ".form__send"
    ) as HTMLButtonElement;
    const maxLength: number = target.maxLength - 100;
    const isErrorHTML: HTMLElement = formParent?.querySelector(
      ".form__limit-error"
    ) as HTMLElement;

    addlengthCountToHTML();

    toggleStatSubmit();

    if (target.value.length === 0) target.removeAttribute("style");

    target.value.length > maxLength ? showWarnings() : hideWarnings();

    function addlengthCountToHTML(): void {
      limitHTML.innerHTML = ``;
      limitHTML.innerHTML = `${target.value.length}/${maxLength}`;
    }

    function showWarnings(): void {
      const templateError: string = `<div class="form__limit-error">Слишком длинное сообщение</div>`;
      if (isErrorHTML) isErrorHTML.remove();
      limitHTML.style.color = "red";
      limitHTML.insertAdjacentHTML("afterend", templateError);
    }

    function hideWarnings(): void {
      limitHTML.style.color = "";
      if (isErrorHTML) isErrorHTML.remove();
    }

    function toggleStatSubmit() {
      return target.value.length > 0 && target.value.length <= maxLength
        ? (sendBtn.disabled = false)
        : (sendBtn.disabled = true);
    }
  };

  private getDateNow(): string {
    const date: Date = new Date();
    const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${date.getDate()}.${month}`;
  }

  private getTimeNow(): string {
    const date: Date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  private sendForm = (event: Event): void => {
    event.preventDefault();
    const textArea: HTMLTextAreaElement = this.getFormContext(
      this.getContext,
      event
    ).querySelector(".form__textarea") as HTMLTextAreaElement;
    const textComment: string = textArea.value;
    this.data.text = textComment;
    this.addToLocalStorage(textComment);
    this.resetForm(event);
    this.comments.countReplies(this.data.replyData.id as string);

    const type: string = (
      document.querySelector(".selection__btn--totgglelist") as HTMLElement
    ).dataset.type as string;

    const ascendingHTML: HTMLElement = document.querySelector(
      ".selection__btn--totgglesort"
    ) as HTMLElement;
    const ascending: boolean = JSON.parse(
      ascendingHTML.dataset.ascending || "null"
    ) as boolean;
    this.comments.showComments(false, type, ascending);

    new Filter().updateCountComments();
  };

  private addToLocalStorage(textComment: string): void {
    if (textComment) {
      const comments: Array<Object> = JSON.parse(
        localStorage.getItem("comments") || "[]"
      );
      comments.push(this.data);
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }

  private resetForm(event: Event): void {
    return this.getFormContext(this.getContext, event).reset();
  }

  public initForm(HTMLElement: HTMLElement, reply: boolean): void {
    const formHtml: string = this.render(reply);
    if (!HTMLElement) {
      const startTarget: HTMLElement = document.querySelector(
        ".filter"
      ) as HTMLElement;
      startTarget.insertAdjacentHTML("afterend", formHtml);
    } else {
      HTMLElement.insertAdjacentHTML("afterend", formHtml);
    }

    const form: NodeListOf<Element> = document.querySelectorAll(".form");
    form.forEach((form) => {
      const textarea: HTMLTextAreaElement = form.querySelector(
        ".form__textarea"
      ) as HTMLTextAreaElement;
      const sendBtn: HTMLButtonElement = form.querySelector(
        ".form__send"
      ) as HTMLButtonElement;
      textarea?.addEventListener("input", this.autoResizeTextarea);
      sendBtn?.addEventListener("click", this.sendForm);
    });

    if (HTMLElement.classList.contains("comment")) {
      const targetParent: HTMLElement = HTMLElement;
      const nameHTML: HTMLElement = targetParent.querySelector(
        ".comment__name"
      ) as HTMLElement;

      this.data.replyData = {
        id: targetParent.id,
        name: nameHTML.innerText,
      };
    }
  }
}
