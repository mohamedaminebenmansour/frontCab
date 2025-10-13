import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { EWMAturizedStatusComponent } from './pages/ewm-aturized-status/ewm-aturized-status.component';
import { EWMParckDisplayGroupeComponent } from './pages/ewm-parck-display-groupe/ewm-parck-display-groupe.component'; // Add this import
import { EwmStorageBinTypeComponent } from './pages/ewm-storage-bin-type/ewm-storage-bin-type.component';
import { EwmStorageBinGroupeComponent } from './pages/ewm-storage-bin-groupe/ewm-storage-bin-groupe.component';
import { EwmStorageTypeComponent } from './pages/ewm-storage-type/ewm-storage-type.component';
import { EWMStorageBinRulesComponent } from './pages/ewm-storage-bin-rules/ewm-storage-bin-rules.component';
import { EwmStorageBinsComponent } from './pages/ewm-storage-bins/ewm-storage-bins.component';
import { EwmStorageBinDetailsComponent } from './pages/ewm-storage-bin-details/ewm-storage-bin-details.component';
import { HandlingUnitsComponent } from './pages/handling-units/handling-units.component';
import { StockMovementsComponent } from './pages/stock-movements/stock-movements.component';
import { BinListComponent } from './groups/bin-list/bin-list.component';
import { GroupFormComponent } from './groups/group-form/group-form.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { BinFormComponent } from './groups/bin-form/bin-form.component';
import { StorageBinRulesComponent } from './pages/storage-bin-rules/storage-bin-rules.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title: 'Ecommerce Dashboard ',
      },
      {
        path: 'calendar',
        component: CalenderComponent,
        title: 'Calender ',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile Dashboard ',
      },
      {
        path: 'form-elements',
        component: FormElementsComponent,
        title: 'Form Elements Dashboard ',
      },
      {
        path: 'basic-tables',
        component: BasicTablesComponent,
        title: 'Basic Tables Dashboard ',
      },
      {
        path: 'blank',
        component: BlankComponent,
        title: 'Blank Dashboard ',
      },
      {
        path: 'invoice',
        component: InvoicesComponent,
        title: 'Invoice Details Dashboard ',
      },
      {
        path: 'line-chart',
        component: LineChartComponent,
        title: 'Line Chart Dashboard ',
      },
      {
        path: 'bar-chart',
        component: BarChartComponent,
        title: 'Bar Chart Dashboard ',
      },
      {
        path: 'alerts',
        component: AlertsComponent,
        title: 'Alerts Dashboard ',
      },
      {
        path: 'avatars',
        component: AvatarElementComponent,
        title: 'Avatars Dashboard ',
      },
      {
        path: 'badge',
        component: BadgesComponent,
        title: 'Badges Dashboard ',
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
        title: 'Buttons Dashboard ',
      },
      {
        path: 'images',
        component: ImagesComponent,
        title: 'Images Dashboard ',
      },
      {
        path: 'videos',
        component: VideosComponent,
        title: 'Videos Dashboard ',
      },
      {
        path: 'aturized-statuses',
        component: EWMAturizedStatusComponent,
        title: 'Authorized Statuses Dashboard ',
      },
      {
        path: 'parck-display-groupes',
        component: EWMParckDisplayGroupeComponent,
        title: 'Park Display Groups Dashboard ',
      }, // Added route
      {
        path: 'ewm-storage-bin-type',
        component: EwmStorageBinTypeComponent,
        title: 'Park Storage Bin Type ',
      }, // Added route
      {
        path: 'ewm-storage-bin-groupe',
        component: EwmStorageBinGroupeComponent,
        title: 'Park Storage Bin groupe ',
      }, // Added route
      {
        path: 'ewm-storage-type',
        component: EwmStorageTypeComponent,
        title: 'Park Storage Type ',
      },
      {
        path: 'ewm-storage-bin-rules',
        component: EWMStorageBinRulesComponent,
        title: 'Storage Bin Rules',
      },
      {
        path: 'storage-bins',
        component: EwmStorageBinsComponent,
        title: 'Storage Bin',
      },
      {
        path: 'storage-bin-details',
        component: EwmStorageBinDetailsComponent,
        title: 'Storage Bin Details',
      },
      {
        path: 'storage-bin-details',
        component: EwmStorageBinDetailsComponent,
        title: 'Storage Bin Details',
      },
      {
        path: 'handling-units',
        component: HandlingUnitsComponent,
        title: 'Storage Bin Details',
      },
      {
        path: 'stock-movements',
        component: StockMovementsComponent,
        title: 'Stock Movements',
      },
      { path: 'groups', component: GroupListComponent,title: 'park groups', },
  { path: 'group-form', component: GroupFormComponent, title: 'park group form', },
  { path: 'group-form/:id', component: GroupFormComponent,title: 'group-form', },
  { path: 'bins/:id', component: BinListComponent ,title: 'group bins',},
  { path: 'bin-form/:groupId', component: BinFormComponent ,title: 'add bins',}, // For add
  { path: 'bin-form/:groupId/:binId', component: BinFormComponent ,title: 'edit bins',}, // For edit
{ path: 'storage-bin-rules', component: StorageBinRulesComponent,title:'Storage Bin Rules' },
{
  path: 'users',
  component: UsersManagementComponent,
  title: 'User Management',
  canActivate: [roleGuard],
  data: { roles: ['SuperAdmin'] }
},
  
    ],
  },
  // auth pages
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Sign In Dashboard ',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Sign Up Dashboard ',
  },
  // error pages
  {
    path: '**',
    component: NotFoundComponent,
    title: 'NotFound Dashboard ',
  },
];