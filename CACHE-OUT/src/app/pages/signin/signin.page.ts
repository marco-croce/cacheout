import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { Geocacher } from 'src/app/models/geocacher.model';
import { LoginService } from 'src/app/services/login.service';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { sesso } from 'src/app/models/sesso.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  protected signinFormModel: FormGroup;

  isAlertOpen: boolean = false;
  public alertButtons = [
    {
      text: 'OK',
      handler: () => {
        this.isAlertOpen = false;
      },
    },
  ];
  error: string = '';

  // Estrae la parte della "data" escludendo la parte "time"
  maxDate: string = new Date().toJSON().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private nav: NavController,
    private loginService: LoginService,
    private geocacherService: GeocacherService,
    private alert: AlertController
  ) {
    this.signinFormModel = fb.group({
      nome: [''],
      cognome: [''],
      username: [''],
      password: [''],
      conferma: [''],
      email: [''],
      telefono: [''],
      data: [''],
      uomo: [true],
      donna: [false],
      no: [false]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    let nome = this.signinFormModel.value.nome;
    let cognome = this.signinFormModel.value.cognome;
    let username = this.signinFormModel.value.username;
    let password = this.signinFormModel.value.password;
    let conferma = this.signinFormModel.value.conferma;
    let email = this.signinFormModel.value.email;
    let telefono = this.signinFormModel.value.telefono;
    let data = this.signinFormModel.value.data;
    let uomo = this.signinFormModel.value.uomo;
    let donna = this.signinFormModel.value.donna;
    let no = this.signinFormModel.value.no;

    if (await this.geocacherService.findGeocacherByUsername(username)) {
      this.onExistingUsername();
      return;
    }

    if (password != conferma) {
      this.onWrongCheckPassword();
      return;
    }

    if (!this.checkEmail()) return;
    if (!this.checkTelefono()) return;

    let geocacher: Geocacher = new Geocacher();
    geocacher.nome = nome;
    geocacher.cognome = cognome;
    geocacher.username = username;
    geocacher.password = password;
    geocacher.dataNascita = new Date(data);
    geocacher.sesso = this.checkSesso(uomo, donna);
    geocacher.email = email;
    geocacher.telefono = telefono;

    //Imposta una foto di default quando un utente si registra
    geocacher.foto = {
      base64String:
        '/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABaAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5Qzk3OUU0QkM2ODMxMUUxQkMwRTg4RjYzMDlFN0QzQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5Qzk3OUU0Q0M2ODMxMUUxQkMwRTg4RjYzMDlFN0QzQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjlDOTc5RTQ5QzY4MzExRTFCQzBFODhGNjMwOUU3RDNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjlDOTc5RTRBQzY4MzExRTFCQzBFODhGNjMwOUU3RDNBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAV4gAAJd4AADd6AABDC//b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AAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAACSAAAAAAAASAAAAAAAAAAAAAAAA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',
      format: 'jpeg',
      saved: false,
    };

    this.geocacherService.addGeocacher(geocacher);

    this.loginService.login(geocacher.username, geocacher.password);

    this.signinFormModel.reset;
    this.nav.navigateRoot('home');
  }

  async onChangeCheckbox(checkbox: string) {
    switch (checkbox) {
      case 'uomo':
        this.signinFormModel.get('uomo')?.setValue(true);
        this.signinFormModel.get('no')?.setValue(false);
        this.signinFormModel.get('donna')?.setValue(false);
        return;
      case 'donna':
        this.signinFormModel.get('uomo')?.setValue(false);
        this.signinFormModel.get('no')?.setValue(false);
        this.signinFormModel.get('donna')?.setValue(true);
        return;
      case 'no':
        this.signinFormModel.get('uomo')?.setValue(false);
        this.signinFormModel.get('no')?.setValue(true);
        this.signinFormModel.get('donna')?.setValue(false);
        return;
    }
  }

  private onExistingUsername() {
    this.error = 'Lo username desiderato non è disponibile!';
    this.isAlertOpen = true;
  }

  private onWrongCheckPassword() {
    this.error = 'Le password non corrispondono!';
    this.isAlertOpen = true;
  }

  private checkSesso(uomo: boolean, donna: boolean) {
    if (uomo) return sesso.Uomo;
    if (donna) return sesso.Donna;
    return sesso.NonSpecificato;
  }

  private checkEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signinFormModel.value.email)) {
      this.error = "L' email inserita non è stata digitata correttamente!";
      this.isAlertOpen = true;
      return false;
    }
    return true;
  }

  private checkTelefono() {
    if (!/^\d+$/.test(this.signinFormModel.value.telefono)) {
      this.error = 'Il numero di telefono deve contenere solo valori numerici!';
      this.isAlertOpen = true;
      return false;
    }
    return true;
  }
}
