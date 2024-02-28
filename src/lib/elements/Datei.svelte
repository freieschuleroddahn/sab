<script>
    export let document;
</script>

<div class="card">
    <div class="content">
      <i class="right floated check icon pointer" class:green={document.done} on:click={()=>{document.done=!document.done}}></i>
      <i class="right floated eye icon"  class:green={document.downloaded}></i>
      <div class="header">{document.name}</div>
      <div class="meta">
          <span class="category">{document.file}</span>
        </div>
      <div class="description">
        {document.beschreibung}
      </div>
    </div>
    <a class="ui button" href="{`https://sab.pockethost.io/api/files/${document.collectionName}/${document.id}/${document.file}`}" target="_blank" on:click={()=>{document.downloaded=true}}>
      <i class="download icon"></i>
      Herunterladen
    </a>
  </div>