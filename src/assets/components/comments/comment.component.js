import { PostService } from '../../services/post.service.js';

export class Comments extends HTMLElement {

    #postService = new PostService();

    constructor() {
        super();
    }

    connectedCallback() {
        const postId = this.getAttribute('post-id');
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);
        this.#consultarComentarios(postId, shadow);
    }

    #agregarEstilos(shadow) {
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '../src/assets/components/comments/comment.component.css');
        shadow.appendChild(link);
    }

    #render(shadow) {
        shadow.innerHTML += `
        <details>
            <summary>
                <a href="#">Comentarios (<span id="cantidad"></span>)</a>
            </summary>
            <div id="divComments" class="comments">

            </div>
        </details>
        <template id="tmpComment">
        <div class="commentsbox">
            <p><b id="user"></b></p>
            <p id="body"></p>
        </div>
        </template>
        `;
    }

    #consultarComentarios(postId, shadow) {
        this.#postService.obtenerComentarios(postId)
        .then(comentarios => {
            let span = shadow.querySelector('#cantidad');
            span.innerHTML = comentarios.length;
            let div = shadow.querySelector('#divComments');
            let tmp = shadow.querySelector('#tmpComment');
            comentarios.forEach(comment => {
                this.#desplegarComentario(tmp, div, comment);
            });
        });
    }

    #desplegarComentario(tmp, div, comment) {
        let clone = tmp.content.cloneNode(true);
        let element = clone.querySelector('#user');
        element.innerHTML = comment.email;
        element = clone.querySelector('#body');
        element.innerHTML = comment.body;
        div.appendChild(clone);
    }

}