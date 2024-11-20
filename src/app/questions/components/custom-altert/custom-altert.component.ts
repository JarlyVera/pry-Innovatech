import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-altert',
  templateUrl: './custom-altert.component.html',
  styleUrls: ['./custom-altert.component.scss'],
})
export class CustomAltertComponent  implements OnInit {

  @ViewChild('audioElement', {static:false}) audioElement!: ElementRef<HTMLAudioElement>;
  @Input() data!:{message: string; imageUrl:string; audio?: string; ICA: number};

  constructor(private modalCtrl: ModalController) { }
  public backgroundColor: string = 'var(--ion-color-light)';
  public alertClass: string = 'alert-message';
  public danger: string = '';
  ngOnInit() {
    this.validateStyleICA();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.validateStyleICA();
    }
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

  public changeBackground(colorType: string) {
    this.backgroundColor = `var(--ion-color-${colorType})`;
  }

  public changeAlertClass(newClass: string) {
    this.alertClass = newClass;
  }

  public validateStyleICA(): void{
    if(this.data?.ICA <= 0.34 || this.data?.ICA>= 0.50){
      this.changeBackground('danger');
      this.changeAlertClass('alert-message__white');
      this.danger = 'En Riesgo'
    }else{
      this.changeBackground('light');
      this.changeAlertClass('alert-message');
      this.danger = 'No en Riesgo'
    }
  }

}
