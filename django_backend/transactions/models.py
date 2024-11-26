from django.db import models, transaction
from bank_account.models import BankAccount
from datetime import timedelta


class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('deposit', 'deposit'),
        ('withdrawal', 'withdrawal'),
        ('transfer out', 'transfer out'),
        ('transfer in', 'transfer in'),
    ]
    
    TRANSACTION_STATUS_CHOICES = [
        ('completed', 'completed'),
        ('pending', 'pending'),
        ('failed', 'failed'),
    ]
    
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=12, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=9, choices=TRANSACTION_STATUS_CHOICES, default='pending')
    transaction_date = models.DateTimeField(auto_now_add=True)
    provider = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        abstract = True
        
    def update_balance(self):
        if self.status == 'pending':
            # transaction.atomic() is not our 'Transaction' class but rather a database transaction or unit of change in the database
            with transaction.atomic():
                # select_for_update() locks the bank_account record until transaction is completed/failed to avoid concurrent access and race condtions
                bank_account = BankAccount.objects.select_for_update().get(id=self.bank_account.id)
                
                if self.transaction_type == 'deposit':
                    bank_account.balance += self.amount
                    self.status = 'completed'
                elif self.transaction_type == 'withdrawal':
                    if bank_account.balance >= self.amount:
                        bank_account.balance -= self.amount
                        self.status = 'completed'
                    else:
                        self.status = 'failed'
                        raise ValueError("Insufficient funds for withdrawal")
                else:
                    self.status = 'failed'
                    raise ValueError("Transaction type not specified")

                # save the updated balance to the associated bank account
                bank_account.save()
                
    # overriding the built in 'save()' method such that saving a transaction to the database will call update_balance() and process the transaction on the associated bank account
    def save(self, *args, **kwargs):
        self.update_balance()
        super().save(*args, **kwargs)
        
        
# Differenct transaction types below to meet various required features


# class ATMTransaction(Transaction):
    # To be implemented  

        
class InternalAccountTransfer(Transaction):
    # Set to on ON DELETE SET NULL such that when an account involved in a transaction is deleted, that record remains in DB for the other account involved
    other_bank_account = models.ForeignKey(BankAccount, on_delete=models.SET_NULL, null=True)
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='internal_transfer')
    def update_balance(self):
        if self.status == 'pending':
            # transaction.atomic() is not our 'Transaction' class but rather a database transaction or unit of change in the database
            with transaction.atomic():
                # select_for_update() locks the bank_account record until transaction is completed/failed to avoid concurrent access and race condtions
                bank_account = BankAccount.objects.select_for_update().get(id=self.bank_account.id)
                
                if self.transaction_type == 'transfer in':
                    bank_account.balance += self.amount
                    self.status = 'completed'
                elif self.transaction_type == 'transfer out':
                    if bank_account.balance >= self.amount:
                        bank_account.balance -= self.amount
                        self.status = 'completed'
                    else:
                        self.status = 'failed'
                        raise ValueError("Insufficient funds for transfer")
                else:
                    self.status = 'failed'
                    raise ValueError("Transaction type not specified")
                bank_account.save()                
                

class DepositTransaction(Transaction):
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='deposits')

    def update_balance(self):
        if self.status == 'pending':
            with transaction.atomic():
                bank_account = BankAccount.objects.select_for_update().get(id=self.bank_account.id)
                bank_account.balance += self.amount
                bank_account.save()


class WithdrawalTransaction(Transaction):
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='withdrawals')

    def update_balance(self):
        if self.status == 'pending':
            with transaction.atomic():
                bank_account = BankAccount.objects.select_for_update().get(id=self.bank_account.id)
                bank_account.balance -= self.amount
                bank_account.save()
                             
class RecurringPayment(Transaction):
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='recurring')
    next_payment_date = models.DateField()
    interval_days = models.IntegerField()
    is_active = models.BooleanField(default=True)
    
    def update_balance(self):
        with transaction.atomic():
            bank_account = BankAccount.objects.select_for_update().get(id=self.bank_account.id)
            bank_account.balance -= self.amount
            bank_account.save()
        self.next_payment_date += timedelta(days=self.interval_days)
        self.save()
                