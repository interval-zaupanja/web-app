<template>
    <button
        class="side-button prijaviNapakoGumb"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Prijavi napako"
        @click="this.toggleModal('show')"
    >
        <img src="https://img.icons8.com/ios-filled/100/flag--v1.png"/>
    </button>

    <div class="modal fade" :id="this.modalID" tabindex="-1" role="dialog" :aria-labelledby="this.modalID" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" :id="this.modalID" >Prijavi napako</h5>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Tip:</label>
                            <input type="text" class="form-control" id="recipient-name" :value="this.tip" disabled>
                        </div>
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">ID:</label>
                            <input type="text" class="form-control" id="recipient-name" :value="this.id" disabled>
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Sporočilo:</label>
                            <textarea class="form-control" id="message-text"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="this.toggleModal('hide')">Zapri</button>
                    <button type="button" class="btn btn-primary">Pošlji prijavo</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script> // brez setup
import { Tooltip } from 'bootstrap'
import bootstrap from 'bootstrap/dist/js/bootstrap.js'

export default {
    name: 'CopyLink',
    props: [ 'id', 'tip'],
    data() {
        return {
           modalID: 'prijaviNapakoModal' + this.tip + this.id,
           modal: null
        }
    },
    methods: {
        toggleModal(toggle) {
            if (toggle === 'show') {
                this.modal.show()
            } else if (toggle === 'hide') {
                this.modal.hide()
            }
        }
    },
    mounted() {
        new Tooltip(document.body, {selector: "[data-bs-toggle='tooltip']"})
        this.modal = new bootstrap.Modal(document.getElementById(this.modalID))
    }
}
</script>

<style scoped>
img {
    height: 15px;
    float: right; /* to sicer popravi poravnavo, vendar ne vem točno zakaj */
}

.prijaviNapakoGumb {
    height: 30px;
    width: 30px;
    padding: 5px;

    background-color: transparent;

    border: 2px solid black;
    border-radius: 5px;
}
</style>