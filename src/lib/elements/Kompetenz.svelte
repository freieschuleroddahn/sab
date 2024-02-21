<div class="ui fluid cards">
    <div class="ui fluid card">
      <div class="content">
        <div class="right floated">
            <div class="ui buttons">
                <div class="ui basic red button">Kennengelernt</div>
                <div class="ui basic orange button">Geübt</div>
                <div class="ui basic green button">Beherscht</div>
              </div>
        </div>
        <!-- <img class="right floated mini ui image" src="/images/avatar/large/elliot.jpg"> -->
        <div class="header">
          Ich kann ganze Zahlen darstellen
        </div>
        <div class="meta">
          L1, L2
        </div>
        <div class="description">
            <p>Beschreibenden Text (Markdown?)</p>
        </div>
        
        <div class="ui cards">
            {#each ['Arbeitsblatt (pdf/.docx)','Video (mp4)','Bild'] as document}
            <div class="card">
              <div class="content">
                <i class="right floated check icon"></i>
                <i class="right floated eye icon"></i>
                <div class="header">Addition</div>
                <div class="meta">
                    <span class="category">{document}</span>
                  </div>
                <div class="description">
                  Beschreibung
                </div>
              </div>
              <a class="ui button" href="#" target="_blank">
                <i class="download icon"></i>
                Herunterladen
              </a>
            </div>
            {/each}
          </div>


      </div>
      <div class="extra content">
        Optional Fotos/Dateien hochladen zur persöhnlichen Dokumentation
      </div>
    </div>
  </div>