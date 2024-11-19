import { Component, OnInit } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomAltertComponent } from './components/custom-altert/custom-altert.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  public personForm: FormGroup;
  public register: boolean = false;
  // Son 12 campos de entrada
  constructor(
    private fb:FormBuilder,
    private modalController: ModalController
  ) {
    this.personForm = this.fb.group(
      {
        name: ['',[Validators.required, Validators.maxLength(50)]],
        race: ['',[Validators.maxLength(50)]],
        genere: ["male", [Validators.required]],
        abdominalCircumference:[
          '',
          [
            Validators.required,
            Validators.max(999),
             Validators.pattern(/^\d+(\.\d{1,2})?$/)
          ]
        ], //Enteros y decimales
        age: [
          '',
          [
            Validators.required,
            Validators.max(150),
            Validators.pattern(/^\d+$/),
            Validators.min(1)
          ]
        ], //Solo valores enteros
        weight: [
          '',
          [
            Validators.required,
            Validators.max(999),
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
            Validators.min(1)
          ]
        ],
        height: [
          '',
          [
            Validators.required,
            Validators.max(3),
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
            Validators.min(1)
          ]
        ],
        antecedentFamily: [
          "yes",
          [
            Validators.required
          ]
        ],
        regularTraining: [
          "yes",
          [
            Validators.required
          ]
        ],
        smoke: [
          "no",
          [
            Validators.required
          ]
        ],
        consumptionWater: [
          "yes",
          [
            Validators.required
          ]
        ]
      }
    )

  }

  ngOnInit() {
  }


  //Condición para mostrar el mensaje de error
  public validatorField(field: string): boolean | null{
   return this.personForm.controls[field].errors && this.personForm.controls[field].touched;
  }

  //Imprimir el mensaje de error y retroalimentación
  public getMessageError(field: string): string | null{
    if(!this.personForm.controls[field].errors && !this.personForm.controls[field]){
      return null;
    }

    const error = this.personForm.controls[field].errors || {};

    for(const key of Object.keys(error)){
      switch(key){
        case 'required':
          return "Campo requerido";
        case 'pattern':
          return 'Dato incorrecto';
        case 'max':
          return 'Valor excesivo'
        case 'min':
          return 'Dato incorrecto'
        case 'maxLength':
          return 'Caracteres excesivos'
      }
    }
    return null;
  }

  //Resear los valores del formulario
  private cleanFormulary(): void{
    //Resetear los valores
    this.personForm.reset({
      name: '',
      race: '',
      genere: "male",
      abdominalCircumference: '',
      age:'',
      weight: '',
      height:'',
      antecedentFamily: "yes",
      regularTraining: "yes",
      smoke: "no",
      consumptionWater: "yes",
    });

    //Todos los valores no han sido tocados
    this.personForm.markAsUntouched();

  }

  //Mostrar el Alert
  private async viewAlert(
    genere: string,
  ): Promise <void> {
    // Crear la vista del alert
    const modal = await this.modalController.create({
        component: CustomAltertComponent,
        cssClass: 'alert-Custom',
        componentProps: {
          data: this.validateICA(genere)
        }
      }
    );

    await modal.present();
  }

  private validateICA(genere: string): {message: string, imageUrl: string, audio?: string, ICA?: number}{

      let levelICA: string ;
      const abdominalCircumference: number = parseFloat(this.personForm.get("abdominalCircumference")!.value);
      const height: number = (this.personForm.get("height")!.value * 100);

      if (!genere || !abdominalCircumference || !height) {
        return{message: "Falta datos en el formulario", imageUrl:'../../assets/images/ic-red.png'};
      }
      const ICA: number = abdominalCircumference / height;

      console.log("Valor ICA ->" , ICA);
        if(genere === 'male'){
          levelICA = this.validateGenreMale(ICA);
        }else{
          levelICA = this.validateGenreFemale(ICA);
        }

        if(levelICA === 'Delgadez severa' || levelICA === 'Obesidad mórbida'){
          return {message: levelICA, imageUrl:'../../assets/images/ic-red.png', audio:'../../assets/audio/sn_alarma.mp3', ICA: ICA};
        }else if(levelICA === 'Delgadez leve' ||levelICA === 'Sobrepeso' || levelICA === 'Sobrepeso elevado'){
          return {message: levelICA, imageUrl: '../../assets/images/ic-yellow.png', ICA: ICA};
        }else{
          return {message: levelICA, imageUrl: '../../assets/images/ic-green.png', audio:'../../assets/audio/sn_alarma.mp3', ICA: ICA };
        }
  }

  private validateGenreMale(ICA: number){
    if(ICA < 0.34){
      return 'Delgadez severa';
    }else if(ICA > 0.34 && ICA <= 0.42){
      return 'Delgadez leve';
    }else if(ICA > 0.42 && ICA <= 0.52){
      return 'Peso normal;'
    }else if (ICA > 0.52 && ICA <= 0.57){
      return 'Sobrepeso'
    }else if(ICA > 0.57 && ICA <=0.62){
      return 'Sobrepeso elevado';
    }else{
      return 'Obesidad morbida';
    }
  }

  private validateGenreFemale(ICA: number): string{
    if(ICA < 0.34){
      return 'Delgadez severa';
    }else if(ICA > 0.34 && ICA <= 0.41){
      return 'Delgadez leve';
    }else if(ICA > 0.41 && ICA <= 0.48){
      return 'Peso normal'
    }else if (ICA > 0.48 && ICA <= 0.53){
      return 'Sobrepeso'
    }else if(ICA > 0.53 && ICA <=0.57){
      return 'Sobrepeso elevado';
    }else{
      return 'Obesidad morbida';
    }
  }

  //Registrar los datos del formulario
  public async registerData(): Promise<void>{
      const genere: string = this.personForm.get('genere')!.value;
    if(this.personForm.valid){
      this.register = false;
      await this.viewAlert(genere);
      this.cleanFormulary();
    }else{
      //Marcar a todos como tocados
      this.register = true;
      this.personForm.markAllAsTouched();
    }
  }
}
