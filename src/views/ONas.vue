<script setup>
import { onMounted } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.js'

let modal;

onMounted(() => {
    modal = new bootstrap.Modal(document.getElementById('exampleModal'))
})

const showModal = () => {
    modal.show();
}

const hideModal = () => {
    modal.hide();
}
</script>

<template>
    <div>
        <div>
            <h1>Zahvale</h1>
            <a  href="https://icons8.com/icon/2755/flag">Flag</a> icon by <a href="https://icons8.com">Icons8</a>                
        </div>
    </div>

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" id="primer" @click="showModal()">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="hideModal()">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
</template>