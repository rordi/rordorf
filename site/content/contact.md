---
title: "Kontakt"
date: 2018-04-18T02:00:00+01:00
draft: false
---
Sie können mit folgendem Formular dem Vorstand des Rordorfschen Familienfonds eine Nachricht senden:

{{< rawhtml >}}
    <form netlify>
        <p>
            <label for="from-name">Ihr Name</label>
            <input type="text" name="from-name" required>
        </p>
        <p>
            <label for="from-email">Ihre E-Mail Adresse</label>
            <input type="email" name="from-email" required>
        </p>
        <p>
            <label for="subject">Betreff</label>
            <input type="text" name="subject" required>
        </p>
        <p>
            <label for="message">Nachricht</label>
            <textarea name="message" required></textarea>
        </p>
        <p>
            <button type="submit">Nachricht senden</button>
        </p>
    </form>
{{< /rawhtml >}}
