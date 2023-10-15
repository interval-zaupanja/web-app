<template>
    <button type="button" class="btn btn-primary" v-if="this.tip === 'splosno'" @click="this.showModal()">
        Prijavi splošno napako
    </button>
    <button v-else
        class="side-button prijaviNapakoGumb"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Prijavi napako"
        @click="this.showModal()"
    >
        <img src="https://img.icons8.com/ios-filled/100/flag--v1.png"/>
    </button>

    <div class="modal fade" :id="this.modalID" tabindex="-1" role="dialog" :aria-labelledby="this.modalID" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <form :action="this.apiServer + '/api/prijave'" method="POST">
                    <div class="modal-header">
                        <h5 class="modal-title">Prijavi napako</h5>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Tip</span>
                            <input type="text" class="form-control" :value="this.vrniTipEntitete(this.tip)" disabled required>
                        </div>
                        <div class="input-group mb-3" v-if="this.id">
                            <span class="input-group-text">ID</span>
                            <input type="text" class="form-control" :value="this.id" disabled required>
                        </div>
                        <div class="form-floating">
                            <textarea class="form-control" name="opis" :id="'opis' + this.modalID" placeholder="Opis napake" autofocus></textarea> <!--- autofocus ne deluje -->
                            <label for="floatingTextarea">Opis napake</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="this.hideModal()">Zapri</button>
                        <button type="button" class="btn btn-primary" @click="this.submit()">Oddaj prijavo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Toasts -->
    <div :id="'toastSucess' + this.modalID" class="toast align-items-center text-bg-primary border-0 bg-success toast-position" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">Prijava uspešno oddana. Hvala!</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>

    <div :id="'toastFailure' + this.modalID" class="toast align-items-center text-bg-primary border-0 bg-danger toast-position" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                <div>Prišlo je do napake. Prosimo poskusite znova.</div>
                <div v-if="this.status">Podatki o napaki: {{ this.status }}</div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</template>

<script>
import { Tooltip } from 'bootstrap'
import bootstrap from 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios'

export default {
    name: 'CopyLink',
    props: [ 'id', 'pot', 'tip'],
    data() {
        return {
            modalID: 'prijaviNapakoModal' + this.tip + this.id,
            modal: null,
            option: {
                animation: true,
                delay: 5000
            },
            status: null
        }
    },
    methods: {
        showModal() {
            this.modal.show()
        },
        hideModal() {
            this.modal.hide()
        },
        async submit() {
            await axios.post(this.apiServer + '/api/prijave', {
                tip: this.tip, // v modalnem oknu je polje morda preimenovano, da je bolj uporabniku prijazno
                id: this.id,
                pot: this.pot, // v modalnem oknu je to skrito polje
                opis: document.getElementById('opis' + this.modalID).value
            }).then(() => {
                var toastSucessHTMLElement = document.getElementById('toastSucess' + this.modalID)
                var toastSucessElement = new bootstrap.Toast(toastSucessHTMLElement, this.option)
                toastSucessElement.show()
                this.modal.hide()
                document.getElementById('opis' + this.modalID).value = "" // poskrbi, da se polje po oddaji tudi sprazni
            }).catch (error => {
                this.status = error.message
                var toastFailureHTMLElement = document.getElementById('toastFailure' + this.modalID)
                var toastFailureElement = new bootstrap.Toast(toastFailureHTMLElement, this.option)
                toastFailureElement.show()
            })
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

.toast-position {
  z-index: 7000;
  position: fixed;
  top: 90px;
  right: 20px;
}
</style>