from django.db import models
from django.conf import settings  # To reference the CustomUser model

import random
import string

def account_number_generator():
    random_account_number = ''.join(random.choices(string.digits, k=10))
    while (BankAccount.objects.filter(account_number=random_account_number).exists()):
        random_account_number = ''.join(random.choices(string.digits, k=10))
    return random_account_number

class BankAccount(models.Model):
    # Below are the available values that can be stored in account_type field
    # Notice the values are stored in pairs, the first element of the pair is the actual
    # value stored in the database table. The second is not relevant to our application
    # as its use is for the django administration panel
    ACCOUNT_TYPE_CHOICES = [
        ('checking', 'checking'),
        ('savings', 'savings'),
        ('retirement', 'retirement'),
    ]
    
    ACCOUNT_STATUS_CHOICES = [
        ('active', 'active'),
        ('inactive', 'inactive'),
        ('closed', 'closed'),
    ]
    
    # user is refrence to CustomUser model in 'authentication' folder.
    # related_name='bank_accounts' allows us to refrence bank_account entries via the user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bank_accounts')
    account_number = models.CharField(max_length=10, unique=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=8, choices=ACCOUNT_STATUS_CHOICES)
    # auto_now_add sets Date/Time when a record is created and cannot be changed later
    creation_date = models.DateTimeField(auto_now_add=True)
    # auto_now sets Date/Time whenever record is updated, useful for logging balance changes
    last_update = models.DateTimeField(auto_now=True)
    
    # Database restrictions
    class Meta:
        # Entries in the database tables must have unique user and account_type pairs
        # So for example, The only entries that can exist in table for a userid '123', only entries possible:
        # userid='123' + account_type='checkings'
        # userid='123' + account_type='savings'
        unique_together = ('user', 'account_type')

    def __str__(self):
        return f'{self.account_type} Account ({self.account_number}) - {self.user.email}'
