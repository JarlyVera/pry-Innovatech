import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-altert',
  templateUrl: './custom-altert.component.html',
  styleUrls: ['./custom-altert.component.scss'],
})
export class CustomAltertComponent  implements OnInit {

  @ViewChild('audioElement', {static:false}) audioElement!: ElementRef<HTMLAudioElement>;
  @Input() data!:{message: string; imageUrl:string; audio?: string; ICA?: number};

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  //Validación sobre el audio
  public validateComponentAudio(): boolean{
    return this.data.message === 'Delgadez severa' || this.data.message === 'Obesidad morbida';
  }

  public playAudio(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.play().catch((error) => {
        console.error('Error al reproducir el audio:', error);
      });
    }
  }

  // Cerrar el alert una vez se haya dado clic
  public close(){
    this.modalCtrl.dismiss();
  }


}
